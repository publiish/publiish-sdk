"use client";

import ChunkUploader from "@/lib/chunk-uploader";
import { PUBLISH_API_URL } from "@/lib/config";
import { useRef, useState } from "react";
export default function DragAndDrop() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadTotalProgress, setUploadTotalProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [chunkUploader, setChunkUploader] = useState<ChunkUploader>();

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files["length"]; i++) {
        // setFiles((prevState: any) => [...prevState, e.target.files[i]]);
        setFiles([e.target.files[i]]);
      }
    }
  }

  const handleUploadProgress = (nProgress: number) => {
    setUploadProgress(nProgress);
  }

  function handleSubmitFile(e: any) {
    if (files.length === 0) {
      // no file has been submitted
    } else {
      // write submit logic here
        setIsUploading(true);
        setUploadProgress(0);
        setUploadTotalProgress(0);

        const endpoint = `${PUBLISH_API_URL}/api/files/file_chunk_add?brand_id=1&auth_user_id=1`;
        const uploader = new ChunkUploader({endpoint, file: files[0], chunkSize: 20, uploadProgressCallback: handleUploadProgress})
        
        setChunkUploader(uploader);

        uploader.on('error', (err: any) => {
            console.error('Something bad happened', err.detail);
            setIsUploading(false);
        });
            
        uploader.on('progress', (progress: any) => {
            console.log(`The upload is at ${progress.detail}%`);
            setUploadTotalProgress(progress.detail);
        });
            
        uploader.on('finish', (body: any) => {
            console.log('hahaha - last response body:', body.detail.data);
            setIsUploading(false);
            alert(`File CID is ${body.detail.data.cid}`);
        });

        uploader.on('fileRetry', (msg) => {
            /** msg.detail is an object like:
            * {
            * 	  message: 'An error occured uploading chunk 243. 6 retries left',
            *     chunk: 243,
            *     retriesLeft: 6
            * }
            */
        });

        uploader.on('offline', () => {
          console.log('no problem, wait and see…')
        });

        uploader.on('online', () => {
          console.log('😎')
        });
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        // setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
        setFiles([e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div className="flex items-center justify-center w-full h-full relative">
      <form
        className={`${
          dragActive ? "bg-blue-400" : "bg-blue-100"
        }  p-4 w-1/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          multiple={false}
          onChange={handleChange}
        />

        <p>
          Drag & Drop files or{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{" "}
          to upload
        </p>

        <div className="flex flex-col items-center p-3">
          {files.map((file: any, idx: any) => (
            <div key={idx} className="flex flex-row space-x-5">
              <span>{file.name}</span>
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removeFile(file.name, idx)}
              >
                remove
              </span>
            </div>
          ))}
        </div>
       
        <button
          className="bg-black rounded-lg p-2 mt-3 w-auto hover:bg-gray-600"
          onClick={handleSubmitFile}
        >
          <span className="p-2 text-white">Submit</span>
        </button>

        <div className="flex flex-col gap-4 w-full mt-20">
          <div className="flex flex-row items-center justify-between">
            <span>Total Uploading</span>
            <progress value={uploadTotalProgress} max={100} className="w-[60%]" />
          </div>
          <div className="flex flex-row items-center justify-between">
            <span>Chunk Uploading</span>
            <progress value={uploadProgress} max={100} className="w-[60%]" />
          </div>
        </div>
        
      </form>
      <div className={`absolute flex flex-col top-0 left-0 w-full h-full bg-black/30 z-50 items-center ${!isUploading?'hidden':''}`}>
            <span className="pt-20 font-bold text-48">
              Uploading files, Please wait.
            </span>
            <div className="flex flex-col py-5">
              <span>
                File Size: {files?.at(0)?.size} Bytes
              </span>
              <span>
                Chunk Size: 20 MB
              </span>
            </div>
            <div className="pb-5">
              <button 
                className="border border-1 p-2 bg-gray-300 hover:bg-gray-500"
                onClick={()=>{
                  chunkUploader?.togglePause();
              }}>
                Pause / Resume
              </button>
            </div>
      </div>
    </div>
  );
}