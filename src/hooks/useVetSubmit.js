import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { useAction } from "@/context/ActionContext";
import VetServices from "@/services/VetServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useVetSubmit = (id) => {
  const { closeDrawer } = useAction();
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [availability, setAvailability] = useState([]);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const addSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties((prev) => [...prev, trimmed]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
  };

  const addAvailabilitySlot = () => {
    setAvailability((prev) => [
      ...prev,
      { dayOfWeek: 1, start: "09:00", end: "18:00" },
    ]);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAvailabilitySlot = (index, field, value) => {
    setAvailability((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const onSubmit = async ({ name, email, phone, licenseNumber, bio }) => {
    try {
      setIsSubmitting(true);

      const vetData = {
        name,
        email,
        phone,
        licenseNumber,
        bio,
        image: imageUrl,
        specialties,
        availability,
        status: isActive ? "active" : "inactive",
      };

      if (id) {
        const res = await VetServices.updateVeterinarian(id, vetData);
        notifySuccess(res.message || "Veterinario actualizado");
      } else {
        const res = await VetServices.createVeterinarian(vetData);
        notifySuccess(res.message || "Veterinario creado");
      }

      setIsSubmitting(false);
      closeDrawer();
      reset();
      queryClient.invalidateQueries(["veterinarians"]);
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err?.response?.data?.message || err?.message || "Error");
    }
  };

  // Reset form for new entry
  useEffect(() => {
    if (!id) {
      reset();
      setImageUrl("");
      setIsActive(true);
      setSpecialties([]);
      setAvailability([]);
      setNewSpecialty("");
      clearErrors();
    }
  }, [id, setValue, clearErrors, reset]);

  // Load existing vet data
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await VetServices.getVeterinarian(id);
          if (res) {
            setValue("name", res.name || "");
            setValue("email", res.email || "");
            setValue("phone", res.phone || "");
            setValue("licenseNumber", res.licenseNumber || "");
            setValue("bio", res.bio || "");
            setImageUrl(res.image || "");
            setIsActive(res.status === "active");
            setSpecialties(res.specialties || []);
            setAvailability(res.availability || []);
          }
        } catch (err) {
          notifyError(
            err?.response?.data?.message || "Error cargando veterinario"
          );
        }
      })();
    }
  }, [id, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    isActive,
    setIsActive,
    isSubmitting,
    specialties,
    setSpecialties,
    newSpecialty,
    setNewSpecialty,
    addSpecialty,
    removeSpecialty,
    availability,
    setAvailability,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
  };
};

export default useVetSubmit;
