require('dotenv').config();
const { PORT, BUCKET, ACCESSKEY, SECRETKEY, ENDPOINT, REGION } = process.env;
const express = require('express');
const aws = require('aws-sdk');
const app = express();
const port = PORT;

aws.config.update({
  accessKeyId: ACCESSKEY,
  secretAccessKey: SECRETKEY,
  region: REGION,
  endpoint: ENDPOINT,
  signatureVersion: 'v4',
});
const s3 = new aws.S3();

app.get('/', async (req, res) => {
  let isTruncated = true;
  let startAfter = null;
  let objects = 0;
  let size = 0;

  while (isTruncated) {
    const data = await s3
      .listObjectsV2({ Bucket: BUCKET, StartAfter: startAfter })
      .promise();

    data.Contents?.forEach((object) => {
      objects++;
      size += object.Size / 1024 / 1024 / 1024;
    });

    isTruncated = data.IsTruncated;
    if (isTruncated) {
      startAfter = data.Contents.slice(-1)[0].Key;
    }
  }
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  res.status(200).json({ object: objects, size: Number(size.toFixed(2)) });
});

app.get('*', async (req, res) => {
  res.status(404).json(404);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
