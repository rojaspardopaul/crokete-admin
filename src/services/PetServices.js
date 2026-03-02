import requests from "./httpService";

const PetServices = {
  getAllPets: async () => {
    return requests.get("/pets");
  },
  getShowingPets: async () => {
    return requests.get("/pets/show");
  },
  getPetById: async (id) => {
    return requests.get(`/pets/${id}`);
  },
  addPet: async (body) => {
    return requests.post("/pets/add", body);
  },
  addAllPets: async (body) => {
    return requests.post("/pets/all", body);
  },
  updatePet: async (id, body) => {
    return requests.put(`/pets/${id}`, body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/pets/status/${id}`, body);
  },
  deletePet: async (id) => {
    return requests.delete(`/pets/${id}`);
  },
  deleteManyPets: async (body) => {
    return requests.patch("/pets/delete/many", body);
  },
  updateManyPets: async (body) => {
    return requests.patch("/pets/update/many", body);
  },
};

export default PetServices;
