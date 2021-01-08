import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadImgToCloudinary = (file, prev_img, width, height) => {
  cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
  });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        transformation: [{ width, height, gravity: 'face', crop: 'thumb' }],
      },
      async (error, result) => {
        if (result) {
          if (prev_img) {
            await cloudinary.uploader.destroy(prev_img, (err, deleted) => {
              if (deleted) console.log(deleted);
              if (err) console.log(err);
            });
          }
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};