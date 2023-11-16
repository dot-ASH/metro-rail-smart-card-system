// import { upload, UploadApiOptions } from 'cloudinary-react-native';
// import { Cloudinary } from '@cloudinary/url-gen';
// import { UPLOAD_PRE } from '@env';
// import { CLOUD_NAME } from '@env';

// const cld = new Cloudinary({
//   cloud: {
//     cloudName: CLOUD_NAME,
//   },
//   url: {
//     secure: true,
//   },
// });

// const options: UploadApiOptions = {
//   upload_preset: UPLOAD_PRE,
//   unsigned: true,
// };

// const uploadToCloud = async (uri: string | undefined) => {
//   // if (typeof uri === 'undefined') {
//   //   console.log("upload url is undefined")
//   //   return;
//   // }
//   await upload(cld, {
//     file: uri,
//     options: options,
//     callback: (error: any, response: any) => {
//       if (error) {
//         console.log('upload', error);
//       } else {
//         console.log(response);
//       }
//     },
//   });
// };

// export default uploadToCloud;
