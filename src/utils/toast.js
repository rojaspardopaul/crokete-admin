import { toast } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message) =>
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyError = (message) =>
  toast.error(
    typeof message === "string" ? message : message?.message ?? "Error desconocido.",
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );

export { notifySuccess, notifyError };
