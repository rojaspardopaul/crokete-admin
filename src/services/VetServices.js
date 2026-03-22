import requests from "./httpService";

const VetServices = {
  // ==========================================
  // Config
  // ==========================================
  getConfig: async () => requests.get("/vet/config"),
  updateConfig: async (body) => requests.put("/vet/config", body),

  // ==========================================
  // Veterinarians
  // ==========================================
  getAllVeterinarians: async (params) =>
    requests.get("/vet/veterinarians", { params }),
  getVeterinarian: async (id) => requests.get(`/vet/veterinarians/${id}`),
  createVeterinarian: async (body) =>
    requests.post("/vet/veterinarians", body),
  updateVeterinarian: async (id, body) =>
    requests.put(`/vet/veterinarians/${id}`, body),
  deleteVeterinarian: async (id) =>
    requests.delete(`/vet/veterinarians/${id}`),
  toggleVeterinarianStatus: async (id) =>
    requests.patch(`/vet/veterinarians/${id}/status`),

  // ==========================================
  // Appointments
  // ==========================================
  getAllAppointments: async (params) =>
    requests.get("/vet/admin/appointments", { params }),
  getAppointment: async (id) =>
    requests.get(`/vet/admin/appointments/${id}`),
  updateAppointmentStatus: async (id, body) =>
    requests.patch(`/vet/admin/appointments/${id}/status`, body),
  updateAppointmentNotes: async (id, body) =>
    requests.put(`/vet/admin/appointments/${id}/notes`, body),

  // Stats
  getStats: async () => requests.get("/vet/admin/stats"),

  // Customer Pets (admin view)
  getCustomerPets: async (customerId) =>
    requests.get(`/vet/admin/pets/${customerId}`),
};

export default VetServices;
