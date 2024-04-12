# publiish-api-helper

Simple library which wraps some basic Publiish nest-api calls into simple functions.

## Requirements

- node.js 16.17.0 or higher

## Getting started

### Installation
Library can be used via local install and is not accessible on NPM yet.

```bash
npm install ./../publiish-api-helper/publiish-api-helper-1.0.0.tgz 
```

### Initialization
Library is working directly with Publiish api. Initialize helper like so:

```ts
const publiishApiHelper = new PubliishApiHelper({publiishApiUrl: process.env.PUBLISH_API_URL, apiKey: "Your api key here"});
```

### Upload file to Publiish
To upload data to Publiish server use uploadFile funtion at publiishApiHelper.file class. Content is of type `any`.
As a response, library returns instance of [`IAddResult`](./src/types/type.ts) interface with `CID` and `FileName` properties.

uploadProgressCallback is a callback that triggers the uploard progress.
```ts
publiishApiHelper.files.uploadFile( {
    content: files[0],
    auth_user_id: 1,
    uploadProgressCallback: handleUploadProgress
} ).then((result)=>{
    console.log(`File CID: ${result.data[0].cid}`, `File Name: ${result.data[0].filename}`);
}).catch((error)=>{
    throw error
});
```

### Delete file from Publiish
```ts
publiishApiHelper.files.deleteFile( {
    auth_user_id: 1
    cid: "<file cid here>"
})
```

### Publish file cid to Ipns
To publish your uploaded file to ipns use publish function at publiishApiHelper.ipns class.
```ts
publiishApiHelper.ipns.publish( {
    keyName: "<ipns key name>",
    cid: "<file cid to publish>"
})
```

### Create key for Ipns
```ts
publiishApiHelper.ipns.createKey( {
    keyName: "<ipns key name>"
})
```
