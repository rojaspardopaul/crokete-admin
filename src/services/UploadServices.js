import requests from "./httpService";

const UploadServices = {
  // Sube una imagen (data-URI). El backend la normaliza a webp con tamaño
  // uniforme, la guarda en Supabase Storage y devuelve la URL final. `square`
  // true para productos (1000×1000 con relleno), false para conservar la
  // proporción (logos y avatares).
  uploadImage: async (file, { folder = "crokete", square = true } = {}) => {
    return requests.post("/upload/image", { file, folder, square });
  },
};

export default UploadServices;
