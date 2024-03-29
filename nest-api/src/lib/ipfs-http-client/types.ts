//#region interfaces
export interface IAddResult {
    Hash: string;
    Size: number;
}
  
export interface IObject {
    Hash: string;
    Links: IEntry[];
}
  
export interface IClientError {
    status: number;
    statusText: string;
    message: string;
    error?: any;
}
  
export interface IStat {
    Hash: string;
    Size: number;
    CumulativeSize: number;
    /**
     * file, directory
     */
    Type: string;
}
  
export interface IEntry {
    Name: string;
    /**
     * 0 = file, 1 = directory
     */
    Type: number;
    Hash: string;
    /**
     * 0 if directory, greater otherwise
     */
    Size: number;
}
  
export interface IKeyGenResult {
    Id: string;
    Name: string;
}
  
export interface INamePublishResult {
    Name: string;
    Value: string;
}

export interface INameResoveResult {
    Path: string;
}
//#endregion

export class ClientError implements IClientError {
    status: number;
    statusText: string;
    message: string;
    error?: any;
  
    constructor(err: any) {
        console.error(err);
        this.error = err;
  
      //Handle response error
        if (this.error.response) {
            this.status = this.error.response?.status;
            this.statusText = this.error.response?.statusText;
            this.message = this.error.response.data?.Message;
    
            if (!this.message && typeof this.error.response.data === "string") {
                this.message = this.error.response.data;
            }
        }
        if (this.error.errors) {
            //Handle Axios API error
            this.status = 400;
            this.statusText = this.error.code;
            this.message = this.error.errors[0].message;
        }
    }
}