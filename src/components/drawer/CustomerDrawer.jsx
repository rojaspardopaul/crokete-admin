import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

//internal import

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCustomerSubmit from "@/hooks/useCustomerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting, colonias, cpLoading, cpError, municipio } =
    useCustomerSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title={"Actualizar Cliente"}
            description={"Actualiza la informacion necesaria de tu cliente aqui"}
          />
        ) : (
          <Title
            title={"Registrar cliente"}
            description={"Registra la informacion necesaria de tu cliente aqui"}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            {/* Datos personales */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Nombres"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Nombres"
                  name="name"
                  type="text"
                  placeholder={"Nombres"}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Correo"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Correo"
                  name="email"
                  type="email"
                  placeholder={"Correo"}
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Teléfono"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Teléfono"
                  name="phone"
                  type="text"
                  placeholder={"Teléfono"}
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Dirección de Envío
              </h3>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Código Postal"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Código Postal"
                    name="postalCode"
                    type="text"
                    placeholder={"44100"}
                  />
                  {cpLoading && (
                    <p className="text-xs text-blue-500 mt-1">Buscando código postal...</p>
                  )}
                  {cpError && (
                    <p className="text-xs text-red-500 mt-1">{cpError}</p>
                  )}
                  <Error errorName={errors.postalCode} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Colonia"} />
                <div className="col-span-8 sm:col-span-4">
                  {colonias.length > 1 ? (
                    <div className="relative">
                      <select
                        {...register("colonia")}
                        className="h-10 text-sm focus:outline-none block w-full bg-white dark:bg-gray-700 border border-input dark:border-gray-500 focus:border-blue-400 rounded-md appearance-none pr-8 px-3"
                      >
                        <option value="">Seleccione una colonia</option>
                        {colonias.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-300">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <InputArea
                      register={register}
                      label="Colonia"
                      name="colonia"
                      type="text"
                      placeholder={"Colonia"}
                    />
                  )}
                  <Error errorName={errors.colonia} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Calle"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Calle"
                    name="calle"
                    type="text"
                    placeholder={"Av. Vallarta"}
                  />
                  <Error errorName={errors.calle} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Núm. Exterior"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Núm. Exterior"
                    name="numExterior"
                    type="text"
                    placeholder={"123"}
                  />
                  <Error errorName={errors.numExterior} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Núm. Interior"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Núm. Interior"
                    name="numInterior"
                    type="text"
                    placeholder={"4A (opcional)"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Municipio"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Municipio"
                    name="municipio"
                    type="text"
                    placeholder={"Se llena con el C.P."}
                    disabled={!!municipio}
                    readOnly={!!municipio}
                  />
                  <Error errorName={errors.municipio} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Referencias"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Referencias"
                    name="referencias"
                    type="text"
                    placeholder={"Entre calle X y calle Y (opcional)"}
                  />
                </div>
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Customer" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default CustomerDrawer;
