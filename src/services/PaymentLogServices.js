import requests from "./httpService";

const PaymentLogServices = {
  getPaymentLogs: async ({
    page = 1,
    limit = 20,
    event,
    status,
    startDate,
    endDate,
    search,
  }) => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (event) params.set("event", event);
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (search) params.set("search", search);

    return requests.get(`/payment-logs?${params.toString()}`);
  },

  getPaymentLogsByOrder: async (orderId) => {
    return requests.get(`/payment-logs/order/${orderId}`);
  },
};

export default PaymentLogServices;
