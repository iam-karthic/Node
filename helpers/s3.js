const S3 = require('aws-sdk/clients/s3');

const region = 'us-east-1';
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } = process.env;

const s3 = new S3({
  region,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

async function getS3file(fileKey) {
  return s3
    .getObject({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    })
    .promise()
    .then((file) => file.Body)
    .then((body) => body.toString());
}

exports.getS3file = getS3file;
