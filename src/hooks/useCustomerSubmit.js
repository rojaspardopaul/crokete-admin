import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CustomerServices from "@/services/CustomerServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";
import usePostalCodeLookup from "@/hooks/usePostalCodeLookup";

const useCustomerSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsUpdate } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const watchedPostalCode = watch("postalCode", "");
  const { colonias, municipio, loading: cpLoading, error: cpError } = usePostalCodeLookup(watchedPostalCode);

  // Auto-fill municipio
  useEffect(() => {
    if (municipio) {
      setValue("municipio", municipio);
    }
  }, [municipio, setValue]);

  // Auto-select colonia when single option
  useEffect(() => {
    if (colonias.length === 1) {
      setValue("colonia", colonias[0]);
    }
  }, [colonias, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const customerData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      const shippingAddressData = {
        name: data.name,
        contact: data.phone,
        email: data.email,
        postalCode: data.postalCode,
        colonia: data.colonia,
        calle: data.calle,
        numExterior: data.numExterior,
        numInterior: data.numInterior || "",
        municipio: data.municipio,
        referencias: data.referencias || "",
        estado: "Jalisco",
        pais: "México",
      };

      if (id) {
        const res = await CustomerServices.updateCustomer(id, customerData);
        // Update shipping address separately
        await CustomerServices.updateShippingAddress(id, shippingAddressData);
        setIsUpdate(true);
        notifySuccess(res.message);
        closeDrawer();
        queryClient.invalidateQueries(["customers"]);
      }
      setIsSubmitting(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    }
  };

  const {
    error,
    isFetched,
    data: customer,
    isLoading: loading,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => CustomerServices.getCustomerById(id),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!id,
  });

  useEffect(() => {
    if (isFetched && id) {
      setValue("name", customer.name);
      setValue("phone", customer.phone);
      setValue("email", customer.email);
      // Populate shipping address fields
      const sa = customer.shippingAddress;
      if (sa) {
        setValue("postalCode", sa.postalCode || "");
        setValue("colonia", sa.colonia || "");
        setValue("calle", sa.calle || "");
        setValue("numExterior", sa.numExterior || "");
        setValue("numInterior", sa.numInterior || "");
        setValue("municipio", sa.municipio || "");
        setValue("referencias", sa.referencias || "");
      }
    }
  }, [id, customer, loading]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    isSubmitting,
    colonias,
    cpLoading,
    cpError,
    municipio,
  };
};

export default useCustomerSubmit;
