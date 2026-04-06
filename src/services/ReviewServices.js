import requests from "./httpService";

const ReviewServices = {
  getAdminReviews: async ({ page, limit, status, rating, search, sortBy, sortOrder }) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (status && status !== "all") params.set("status", status);
    if (rating) params.set("rating", rating);
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    return requests.get(`/reviews/admin?${params.toString()}`);
  },

  getReviewStats: async () => {
    return requests.get("/reviews/stats");
  },

  approveReview: async (id, body = {}) => {
    return requests.put(`/reviews/${id}/approve`, body);
  },

  rejectReview: async (id, body = {}) => {
    return requests.put(`/reviews/${id}/reject`, body);
  },
};

export default ReviewServices;
