import requests from "./httpService";

const AiProductServices = {
  // Check which AI providers are available
  getProviders: async () => {
    return requests.get("/ai/providers");
  },

  // Generate product data with AI
  generateProduct: async (body) => {
    return requests.post("/ai/generate-product", body);
  },
};

export default AiProductServices;
