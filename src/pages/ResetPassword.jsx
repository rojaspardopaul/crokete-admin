import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import ImageLight from "@/assets/img/forgot-password-office.jpeg";
import ImageDark from "@/assets/img/forgot-password-office-dark.jpeg";
import { useHistory } from "react-router-dom";

const ResetPassword = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { token } = useParams();
  const password = useRef("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = ({ newPassword }) => {
    setLoading(true);

    AdminServices.resetPassword({ newPassword, token })
      .then((res) => {
        setLoading(false);
        notifySuccess(res.message);
        history.replace('/login');
      })
      .catch((err) => {
        setLoading(false);
        notifyError(err ? err.response.data.message : err.message);
      });
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("ResetPassword")}
              </h1>

              <form onSubmit={handleSubmit(submitHandler)}>
                <LabelArea label="Contraseña" />
                <Input
                  label="Contraseña"
                  name="newPassword"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  {...register("newPassword", {
                    required: "Debe especificar una contraseña",
                    minLength: {
                      value: 10,
                      message: "La contraseña debe tener al menos 10 caracteres",
                    },
                  })}
                />
                <Error errorName={errors.newPassword} />
                <div className="mt-6"></div>
                <LabelArea label="Confirmar Contraseña" />
                <Input
                  label="Confirmar Contraseña"
                  name="confirm_password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("ConfirmPassword")}
                  {...register("confirm_password", {
                    validate: (value) =>
                      value === password.current ||
                      "Las contraseñas no coinciden",
                  })}
                />
                <Error errorName={errors.confirm_password} />

                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-4 h-12"
                >
                  {t("Reset")}
                </Button>
              </form>
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/login"
                >
                  {t("AlreadyAccount")}
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
