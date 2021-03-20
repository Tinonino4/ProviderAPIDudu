const express = require('express');
const router = express.Router();
const {
    StorageSharedKeyCredential,
    BlobServiceClient
} = require('@azure/storage-blob');
const {AbortController} = require('@azure/abort-controller');
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;


const ONE_MINUTE = 60 * 1000;

async function uploadLocalFile(aborter, containerClient, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    return await blockBlobClient.uploadFile(filePath,aborter);
}


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

router.post('/send-event-matches', async function (req, res) {

    const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    const blobServiceClient = new BlobServiceClient("https://"+STORAGE_ACCOUNT_NAME+".blob.core.windows.net",credentials);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const aborter = AbortController.timeout(30 * ONE_MINUTE);

    let i;
    for (i = 1; i < 91; i++) {
        let blobName = i.toString() + '.json';
        let localFilePath = "../repository/apievents/" + blobName;
        const blobClient = containerClient.getBlobClient(blobName);
        const blockBlobClient = blobClient.getBlockBlobClient();

        await uploadLocalFile(aborter, containerClient, localFilePath);
        console.log(`Local file "${localFilePath}" is uploaded`);
        sleep(2000);

        console.log("Uploaded the event" + i.toString())
    }
})


module.exports = router;