import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { SidebarContext } from "@/context/SidebarContext";
import PetServices from "@/services/PetServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";

const usePetSubmit = (id) => {
  const { setIsUpdate, lang } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();
  const [resData, setResData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState("es");
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handlerTextTranslateHandler } = useTranslationValue();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name }) => {
    try {
      setIsSubmitting(true);
      const nameTranslates = await handlerTextTranslateHandler(
        name,
        language,
        resData?.name
      );

      const petData = {
        name: {
          ...nameTranslates,
          [language]: name,
        },
        icon: imageUrl,
        status: published ? "show" : "hide",
      };

      if (id) {
        const res = await PetServices.updatePet(id, petData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
        queryClient.invalidateQueries(["pets"]);
      } else {
        const res = await PetServices.addPet(petData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        queryClient.invalidateQueries(["pets"]);
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "es"]);
    }
  };

  useEffect(() => {
    if (!id) {
      setResData({});
      setValue("name");
      setImageUrl("");
      setPublished(true);
      clearErrors("name");
      setLanguage(lang);
      return;
    }
  }, [setValue, id, openDrawer, clearErrors, lang]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await PetServices.getPetById(id);
          if (res) {
            setResData(res);
            setValue("name", res.name[language ? language : "es"]);
            setImageUrl(res.icon);
            setPublished(res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id]);

  return {
    register,
    language,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    published,
    setPublished,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default usePetSubmit;
