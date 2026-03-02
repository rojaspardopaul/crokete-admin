import requests from "./httpService";

const BrandServices = {
  getAllBrands: async () => {
    return requests.get("/brands");
  },
  getShowingBrands: async () => {
    return requests.get("/brands/show");
  },
  getBrandById: async (id) => {
    return requests.get(`/brands/${id}`);
  },
  addBrand: async (body) => {
    return requests.post("/brands/add", body);
  },
  addAllBrands: async (body) => {
    return requests.post("/brands/all", body);
  },
  updateBrand: async (id, body) => {
    return requests.put(`/brands/${id}`, body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/brands/status/${id}`, body);
  },
  deleteBrand: async (id) => {
    return requests.delete(`/brands/${id}`);
  },
  deleteManyBrands: async (body) => {
    return requests.patch("/brands/delete/many", body);
  },
  updateManyBrands: async (body) => {
    return requests.patch("/brands/update/many", body);
  },
};

export default BrandServices;
