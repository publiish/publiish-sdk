import axios, { AxiosProgressEvent } from "axios";

interface ChunkUploaderParams {
  endpoint: string;
  authToken: string;
  file: File;
  headers?: Record<string, string>;
  postParams?: Record<string, any>;
  chunkSize?: number;
  retries?: number;
  delayBeforeRetry?: number;
  uploadProgressCallback?: (nPercentage: number) => any;
}

class ChunkUploader {
  private endpoint: string;
  private authToken: string;
  private file: File;
  private headers: Record<string, string>;
  private postParams: Record<string, any>;
  private chunkSize: number;
  private retries: number;
  private delayBeforeRetry: number;

  private start: number;
  private chunk: Blob | null;
  private chunkCount: number;
  private totalChunks: number;
  private retriesCount: number;
  private offline: boolean;
  private paused: boolean;

  private uploadProgressCallback ? : (nPercentage: number) => any;

  private _reader: FileReader;
  private _eventTarget: EventTarget;

  constructor(params: ChunkUploaderParams) {
    this.endpoint = params.endpoint;
    this.authToken = params.authToken;
    this.file = params.file;
    this.headers = params.headers || {};
    this.postParams = params.postParams || {};
    this.chunkSize = (params.chunkSize || 10) * 1024 * 1024;   //MB
    this.retries = params.retries || 5;
    this.delayBeforeRetry = params.delayBeforeRetry || 5;
    this.uploadProgressCallback = params.uploadProgressCallback;

    this.start = 0;
    this.chunk = null;
    this.chunkCount = 0;
    this.totalChunks = Math.ceil(this.file.size / (this.chunkSize));
    this.retriesCount = 0;
    this.offline = false;
    this.paused = false;

    this.headers.authorization = `Bearer ${this.authToken}`
    this.headers['uploader-file-id'] = this._uniqid().toString();
    this.headers['uploader-file-name'] = this.file.name;
    this.headers['uploader-chunks-total'] = this.totalChunks.toString();

    this._reader = new FileReader();
    this._eventTarget = new EventTarget();

    this._validateParams();
    this._sendChunks();

    window.addEventListener('online', () => {
      if (!this.offline) return;

      this.offline = false;
      this._eventTarget.dispatchEvent(new Event('online'));
      this._sendChunks();
    });

    window.addEventListener('offline', () => {
      this.offline = true;
      this._eventTarget.dispatchEvent(new Event('offline'));
    });
  }

  on(eType: string, fn: EventListenerOrEventListenerObject): void {
    this._eventTarget.addEventListener(eType, fn);
  }

  private _validateParams(): void {
    if (!this.endpoint || !this.endpoint.length) throw new TypeError('endpoint must be defined');
    if (this.file instanceof File === false) throw new TypeError('file must be a File object');
    if (this.headers && typeof this.headers !== 'object') throw new TypeError('headers must be null or an object');
    if (this.postParams && typeof this.postParams !== 'object') throw new TypeError('postParams must be null or an object');
    if (this.chunkSize && (typeof this.chunkSize !== 'number' || this.chunkSize === 0)) throw new TypeError('chunkSize must be a positive number');
    if (this.retries && (typeof this.retries !== 'number' || this.retries === 0)) throw new TypeError('retries must be a positive number');
    if (this.delayBeforeRetry && (typeof this.delayBeforeRetry !== 'number')) throw new TypeError('delayBeforeRetry must be a positive number');
  }

  private _uniqid(): number {
    return Math.floor(Math.random() * 100000000) + Date.now() + this.file.size;
  }

  private _getChunk(): Promise<Blob> {
    return new Promise((resolve) => {
        const length = this.totalChunks === 1 ? this.file.size : this.chunkSize;
        const start = length * this.chunkCount;

        this._reader.onload = () => {
            if (!this._reader.result) {
              throw new Error("file reading error");
            }

            this.chunk = new Blob([this._reader.result], { type: 'application/octet-stream' });
            
            resolve(this.chunk);
        };

        this._reader.readAsArrayBuffer(this.file.slice(start, start + length));
    });
  }

  private _sendChunk(chunk: Blob): Promise<Response> {
    const form = new FormData();

    // send post fields on last request
    if (this.chunkCount + 1 === this.totalChunks && this.postParams) Object.keys(this.postParams).forEach(key => form.append(key, this.postParams[key]));
    form.append('file', chunk);

    // this.headers['Access-Control-Allow-Origin'] = 'http://20.222.105.67:3000/';
    
    this.headers['uploader-chunk-number'] = this.chunkCount.toString();

    // return fetch(this.endpoint, { method: 'POST', headers: this.headers, body: form });
    return axios.post(this.endpoint, form, {
      headers: {...this.headers, 'Content-Type': 'multipart/form-data'}, 
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        // console.log('progressEvent', progressEvent)
        if (progressEvent.bytes) {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total!) * 100);
          this.uploadProgressCallback?.(percentage);
        }
      },
    } );
  }

  private _manageRetries(): void {
    if (this.retriesCount++ < this.retries) {
        setTimeout(() => this._sendChunks(), this.delayBeforeRetry * 1000);
        this._eventTarget.dispatchEvent(new CustomEvent('fileRetry', { detail: { message: `An error occured uploading chunk ${this.chunkCount}. ${this.retries - this.retriesCount} retries left`, chunk: this.chunkCount, retriesLeft: this.retries - this.retriesCount } }));
        return;
    }

    this._eventTarget.dispatchEvent(new CustomEvent('error', { detail: `An error occured uploading chunk ${this.chunkCount}. No more retries, stopping upload` }));
  }

  private _sendChunks(): void {
    if (this.paused || this.offline) return;

        this._getChunk()
        .then((chunk) => this._sendChunk(chunk))
        .then(res => {
            if (res.status === 200 || res.status === 201 || res.status === 204) {
                if (++this.chunkCount < this.totalChunks) { 
                  this._sendChunks(); 
                } else {
                  // res.text().then(body => {
                  //   this._eventTarget.dispatchEvent(new CustomEvent('finish', { detail: body }));
                  // })
                  this._eventTarget.dispatchEvent(new CustomEvent('finish', { detail: res }));
                }

                const percentProgress = Math.round((100 / this.totalChunks) * this.chunkCount);
                this._eventTarget.dispatchEvent(new CustomEvent('progress', { detail: percentProgress }));
            }

            // errors that might be temporary, wait a bit then retry
            else if ([408, 502, 503, 504].includes(res.status)) {
                if (this.paused || this.offline) return;
                this._manageRetries();
            }

            else {
                if (this.paused || this.offline) return;
                this._eventTarget.dispatchEvent(new CustomEvent('error', { detail: res }));
            }
        })
        .catch((err) => {
            if (this.paused || this.offline) return;

            // this type of error can happen after network disconnection on CORS setup
            this._manageRetries();
        });
  }

  togglePause(): void {
    this.paused = !this.paused;

    if (!this.paused) this._sendChunks();
  }
}

export default ChunkUploader;