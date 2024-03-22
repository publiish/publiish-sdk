import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import Busboy from 'busboy';
import { Request } from 'express'; // Assuming you're using express; adjust if using another framework
import Hash  from 'ipfs-only-hash';
import CID from 'cids';
import multihashing from 'multihashing-async';

interface Headers {
  'uploader-chunk-number': string;
  'uploader-chunks-total': string;
  'uploader-file-id': string;
}

/**
 * Make sure required headers are present & are numbers
 * @param { Object } headers – req.headers object
 * @return { Boolean }
 */
function checkHeaders(headers: { [key: string]: string | string[] | undefined }) : boolean {
    if (
        !headers['uploader-chunk-number'] ||
        !headers['uploader-chunks-total'] ||
        !headers['uploader-file-id'] ||
        !headers['uploader-chunks-total'].toString().match(/^[0-9]+$/) ||
        !headers['uploader-chunk-number'].toString().match(/^[0-9]+$/) ||
        !headers['uploader-file-id'].toString().match(/^[0-9]+$/)
    ) return false;

    return true;
}

/**
 * Make sure total file size isn't bigger than limit
 * @param { Number } maxFileSize
 * @param { Number } maxChunkSize
 * @param { Object } headers – req.headers object
 * @return { Boolean }
 */
function checkTotalSize(maxFileSize: number, maxChunkSize:number, totalChunks: number) : boolean {
    if (maxChunkSize * totalChunks > maxFileSize) return false;
    return true;
}

/**
 * Delete tmp directory containing chunks
 * @param { String } dirPath
 */
export function cleanChunks(dirPath: string) {
    fs.readdir(dirPath, (err, files) => {
        let filesLength = files.length;

        files.forEach((file) => {
            fs.unlink(path.join(dirPath, file), () => {
                if (--filesLength === 0) fs.rmdir(dirPath, () => {}); // cb does nothing but required
            });
        });
    });
}

/**
 * Take all chunks of a file and reassemble them in a unique file
 * @param { String } tmpDir
 * @param { String } dirPath
 * @param { String } fileId
 * @param { Number } totalChunks
 * @param { Object } postParams – form post fields
 * @return { Function } promised function to start assembling
 */
function assembleChunks(tmpDir: string, dirPath: string, fileId: string, fileName: string, totalChunks: number, postParams: object): Function {
    const asyncReadFile = promisify(fs.readFile);
    const asyncAppendFile = promisify(fs.appendFile);
    const assembledFileDir = path.join(tmpDir, fileId);
    const assembledFile = path.join(assembledFileDir, fileName);

    mkdirIfDoesntExist(assembledFileDir, ()=>{});

    let chunkCount = 0;

    return () => { // eslint-disable-line
        return new Promise((resolve, reject) => {
            const pipeChunk = () => {
                asyncReadFile(path.join(dirPath, chunkCount.toString()))
                .then(chunk => asyncAppendFile(assembledFile, chunk))
                .then(() => {
                    // 0 indexed files = length - 1, so increment before comparison
                    if (totalChunks > ++chunkCount) pipeChunk();

                    else {
                        cleanChunks(dirPath);
                        
                        Hash.of(fs.createReadStream(assembledFile), { cidVersion: 1, rawLeaves: true }).then((cidHash)=>{
                            resolve({ filePath: assembledFile, cid:cidHash, postParams });
                        });
                    }
                })
                .catch(reject);
            };

            pipeChunk();
        });
    };
}

/**
 * Create directory if it doesn't exist
 * @param { String } dirPath
 * @param { Function } callback
 */
function mkdirIfDoesntExist(dirPath: string, callback: (err)=>void) {
    fs.stat(dirPath, (err) => {
        if (err) fs.mkdir(dirPath, callback);
        else callback(err);
    });
}

/**
 * write chunk to upload dir, create tmp dir if first chunk
 * return getFileStatus ƒ to query completion status cb(err, [null | assembleChunks ƒ])
 * assembleChunks ƒ is returned only for last chunk
 * @param { String } tmpDir
 * @param { Object } headers
 * @param { Object } fileStream
 * @param { Object } postParams
 * @return { Function } getFileStatus – cb based function to know when file is written. callback(err, assembleChunks ƒ)
 */
function handleFile(tmpDir: string, headers: { [key: string]: string | string[] | undefined }, fileStream: fs.ReadStream, postParams: object): Function {
    const dirPath = path.join(tmpDir, `${headers['uploader-file-id']}_tmp`);
    const chunkPath = path.join(dirPath, headers['uploader-chunk-number'].toString());
    const chunkCount = +headers['uploader-chunk-number'];
    const totalChunks = +headers['uploader-chunks-total'];

    let error: Error;
    let assembleChunksPromise;
    let finished = false;
    let writeStream: fs.WriteStream;

    const writeFile = () => {
        writeStream = fs.createWriteStream(chunkPath);

        writeStream.on('error', (err) => {
            error = err;
            fileStream.resume();
        });

        writeStream.on('close', () => {
            finished = true;

            // if all is uploaded
            if (chunkCount === totalChunks - 1) {
                const fileId = headers['uploader-file-id'].toString();
                const fileName = headers['uploader-file-name'].toString();
                assembleChunksPromise = assembleChunks(tmpDir, dirPath, fileId, fileName, totalChunks, postParams);
            }
        });

        fileStream.pipe(writeStream);
    };

    // make sure chunk is in range
    if (chunkCount < 0 || chunkCount >= totalChunks) {
        error = new Error('Chunk is out of range');
        fileStream.resume();
    }

    // create file upload dir if it's first chunk
    else if (chunkCount === 0) {
        mkdirIfDoesntExist(dirPath, (err) => {
            if (err) {
                error = err;
                fileStream.resume();
            }

            else writeFile();
        });
    }

    // make sure dir exists if it's not first chunk
    else {
        fs.stat(dirPath, (err) => {
            if (err) {
                error = new Error('Upload has expired');
                fileStream.resume();
            }

            else writeFile();
        });
    }

    return (callback) => {
        if (finished && !error) callback(null, assembleChunksPromise);
        else if (error) callback(error);

        else {
            writeStream.on('error', callback);
            writeStream.on('close', () => callback(null, assembleChunksPromise));
        }
    };
}

/**
 * Master function. Parse form and call child ƒs for writing and assembling
 * @param { Object } req – nodejs req object
 * @param { String } tmpDir – upload temp dir
 * @param { Number } maxChunkSize
 */
function chunkReceive(req: Request, tmpDir: string, maxFileSize:number, maxChunkSize: number) {
    return new Promise((resolve, reject) => {
        if (!checkHeaders(req.headers)) {
            reject(new Error('Missing header(s)'));
            return;
        }

        if (!checkTotalSize(maxFileSize, maxChunkSize, Number(req.headers['uploader-chunks-total']))) {
            reject(new Error('File is above size limit'));
            return;
        }

        try {
            const postParams = {};
            let limitReached = false;
            let getFileStatus;

            const busboy = new Busboy({ headers: req.headers, limits: { files: 1, fileSize: maxChunkSize * 1024 * 1024 } });

            busboy.on('file', (fieldname, fileStream) => {
                fileStream.on('limit', () => {
                    limitReached = true;
                    fileStream.resume();
                });

                getFileStatus = handleFile(tmpDir, req.headers, fileStream, postParams);
            });

            busboy.on('field', (key, val) => {
                postParams[key] = val;

            });

            busboy.on('finish', () => {

                if (limitReached) {
                    reject(new Error('Chunk is above size limit'));
                    return;
                }

                getFileStatus((fileErr, assembleChunksF) => {
                    if (fileErr) reject(fileErr);
                    else resolve(assembleChunksF);
                });
            });

            req.pipe(busboy);
        }

        catch (err) {
            console.log('err1', err)
            reject(err);
        }
    });
}

export default chunkReceive;