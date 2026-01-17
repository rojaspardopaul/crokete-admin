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
  const { register, handleSubmit, onSubmit, errors, isSubmitting } =
    useCustomerSubmit(id);

  // console.log('##CustomerDrawer',)
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

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Dirección"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Dirección"
                  name="address"
                  type="text"
                  placeholder={"Dirección"}
                />
                <Error errorName={errors.address} />
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
