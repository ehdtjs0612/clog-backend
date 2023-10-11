require("dotenv").config();

const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const path = require("path");
const awsConfig = require('../../config/aws');
const allowedExtensions = ['.png', '.jpg', '.jpeg'];
const { BadRequestException } = require("../module/customError");

AWS.config.update(awsConfig);
const s3 = new AWS.S3();
const clubProfileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, callback) => {
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new BadRequestException("파일 형식을 확인해주세요"));
            }
            callback(null, `club/profile/${Date.now()}_${file.originalname}`);
        },
        acl: "public-read-write"
    }),
    limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
    }
});

const clubBannerUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, callback) => {
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new BadRequestException("파일 형식을 확인해주세요"));
            }
            callback(null, `club/banner/${Date.now()}_${file.originalname}`);
        },
        acl: "public-read-write"
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 1MB
    }
});

module.exports = {
    clubProfileUploader: () => {
        return async (req, res, next) => {
            clubProfileUpload.single("clubProfile")(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return next(new BadRequestException("멀터에러 님이잘못함"));
                }
                if (err) {
                    return next(err);
                }
                console.log(`clubProfileUpload 실행`); // 개발환경 전용
                next();
            });
        }
    },

    clubBannerUploader: () => {
        return async (req, res, next) => {
            clubBannerUpload.single("clubBanner")(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // 1. 이미지 용량이 큰 경우?
                    return next(new BadRequestException("파일 용량은 5MB 이하여야합니다"));
                }
                if (err) {
                    return next(err);
                }
                console.log(`clubProfileUpload 실행`); // 개발환경 전용
                next();
            });
        }
    }
}