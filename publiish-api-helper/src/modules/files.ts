import axios, { AxiosProgressEvent } from "axios";
import { DeleteFileResponse, UploadFileResponse } from "../types/type";
import { APITOKEN, UCANTOKEN } from "..";



export class Files {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async uploadFile( args: {
    content: any;
    auth_user_id: number;
    uploadProgressCallback?: (percentage: number)=>void;
    token: APITOKEN | UCANTOKEN; 
  }): Promise<UploadFileResponse> {
    try {
      const form = new FormData();
      form.append("file", args.content);

      const url = `${this.url}/api/files/file_add_update?auth_user_id=${args.auth_user_id}`;
      const result = await axios.post(url, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${args.token}`,
            'ApiKey': args.token,
          }, 
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.bytes) {
              const percentage = Math.round((progressEvent.loaded / progressEvent.total!) * 100);
              args.uploadProgressCallback?.(percentage);
            }
          }
      });
      
      return {
        success: result.data.success ?? 'N',
        status: result.status,
        data: result.data.data,
      }

    } catch(error) {
      throw error;
    }
  }

  public async deleteFile( args: {
    auth_user_id: number;
    cid: string;
    token: APITOKEN | UCANTOKEN
  }) : Promise<DeleteFileResponse> {
    try {
      const url = `${this.url}/api/files/file_delete?auth_user_id=${args.auth_user_id}&cid=${args.cid}`;
      const result = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${args.token}`,
          'ApiKey': args.token,
        }, 
      });
      return result.data;
    } catch(error) {
      throw error;
    }
  }

  public async download( args: {
    cid: string
  }) {
    try {

      const url = `${this.url}/api/files/download/${args.cid}`;
      return await axios.get(url);

    } catch(error) {
      throw error;
    }
  }

  public async getIpfsLinkUrl( args: {
    cid: string
  }) {
    try {

      const url = `${this.url}/api/files/publish-link/${args.cid}`;
      return await axios.get(url);

    } catch(error) {
      throw error;
    }
  }
}