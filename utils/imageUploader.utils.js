


const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");

const imageUploader = async (images, slugFileName) => {
    const list = Array.isArray(images) ? images : [images];
    const uploadedUrls = [];

    for (const image of list) {
        const ext = path.extname(image.name);
        const finalName = `${slugFileName}-${Date.now()}${ext}`;

        // Read file from tempFilePath
        const fileBuffer = fs.readFileSync(image.tempFilePath);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: finalName,
            Body: fileBuffer,
            ContentType: image.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construct URL manually
        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${finalName}`;
        uploadedUrls.push(url);
    }

    return uploadedUrls;
};

module.exports = imageUploader;






// const s3 = require("../config/awsConfig");
// const path = require("path");

// const imageUploader = async (images, slugFileName) => {
//     const list = Array.isArray(images) ? images : [images];
//     let uploaded = [];

//     for (const image of list) {

//         console.log("image", image)
//         const ext = path.extname(image.name);
       
//         const finalName = `${slugFileName}${ext}`;

//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: finalName,
//             Body: image.data,
//             ContentType: image.mimetype,
//             // ACL: "public-read"
//         };

//         // console.log(s3)
//         const result = await s3.upload(params).promise();

//         uploaded.push({
//             // fileName: finalName,
//             url: result.Location
//         });
//     }

//     return uploaded;
// };

// module.exports = imageUploader;



