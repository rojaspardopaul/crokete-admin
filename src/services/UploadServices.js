import requests from "./httpService";

const UploadServices = {
  // Upload an image (data-URI). The backend normalizes it to webp + uniform
  // size via Cloudinary and returns the final URL. `square` true for product
  // images (1000×1000 padded), false to keep aspect ratio (logos/avatars).
  uploadImage: async (file, { folder = "crokete", square = true } = {}) => {
    return requests.post("/upload/image", { file, folder, square });
  },
};

export default UploadServices;
