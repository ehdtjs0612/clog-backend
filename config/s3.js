require("dotenv").config();

const AWS = require("aws-sdk");
AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECERET_ACCESS_KEY
});

module.exports = AWS;
