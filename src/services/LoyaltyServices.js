import requests from "./httpService";

const LoyaltyServices = {
  // Config
  getConfig: async () => requests.get("/loyalty/config"),
  updateConfig: async (body) => requests.put("/loyalty/config", body),

  // Customers
  getAllCustomersLoyalty: async (params) =>
    requests.get("/loyalty/admin/customers", { params }),
  getCustomerLoyalty: async (id) =>
    requests.get(`/loyalty/admin/customer/${id}`),

  // Adjust points
  adjustPoints: async (body) => requests.post("/loyalty/admin/adjust", body),
};

export default LoyaltyServices;
