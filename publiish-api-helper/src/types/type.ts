export interface UploadFileResponse {
  success: 'Y' | 'N';
  status: number;
  data: {
    cid: string,
    filename: string,
  }[];
}
  
export interface DeleteFileResponse {
  success: 'Y' | 'N';
  status: number;
  data: string;
}

export interface IpnsPublishResponse {
  success: 'Y'|'N',
  status: number,
  data: {
      sequence: string,
      path: string, 
      cid: string
  },
}

export interface IpnsCreateKeyResponse {
  success: 'Y'|'N',
  status: number,
  data: {name: string, id: string}
}