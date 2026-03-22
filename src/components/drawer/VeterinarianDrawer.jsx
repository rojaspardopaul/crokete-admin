import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Uploader from "@/components/image-uploader/Uploader";
import DrawerButton from "@/components/form/button/DrawerButton";
import useVetSubmit from "@/hooks/useVetSubmit";

const VeterinarianDrawer = ({ id }) => {
  const {
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
    availability,
    setAvailability,
    newSpecialty,
    setNewSpecialty,
    addSpecialty,
    removeSpecialty,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
  } = useVetSubmit(id);

  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={id ? "Actualizar Veterinario" : "Agregar Veterinario"}
          description={
            id
              ? "Actualiza la información del veterinario"
              : "Agrega un nuevo veterinario al equipo"
          }
        />
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            {/* Name */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Nombre" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Nombre completo"
                  name="name"
                  type="text"
                  placeholder="Dr. Juan Pérez"
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="vet@crokete.com"
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Teléfono" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Teléfono"
                  name="phone"
                  type="text"
                  placeholder="+52 33 1234 5678"
                />
              </div>
            </div>

            {/* License */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Cédula" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Cédula profesional"
                  name="licenseNumber"
                  type="text"
                  placeholder="Cédula profesional"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Biografía" />
              <div className="col-span-8 sm:col-span-4">
                <textarea
                  {...register("bio")}
                  className="block w-full px-3 py-1 text-sm focus:outline-none leading-5 rounded-md border-gray-200 dark:border-gray-600 focus:ring focus:ring-emerald-300 border h-24 bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Experiencia y formación del veterinario..."
                />
              </div>
            </div>

            {/* Image */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Foto" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="vet"
                />
              </div>
            </div>

            {/* Specialties */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Especialidades" />
              <div className="col-span-8 sm:col-span-4">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                    className="block w-full px-3 py-1 text-sm focus:outline-none leading-5 rounded-md border-gray-200 dark:border-gray-600 focus:ring focus:ring-emerald-300 border bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Ej: Dermatología, Nutrición..."
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full dark:bg-emerald-800 dark:text-emerald-200"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(i)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Horarios" />
              <div className="col-span-8 sm:col-span-4">
                <p className="text-xs text-gray-500 mb-2">
                  Horarios personalizados del veterinario (opcional, se usan los globales si no se configura)
                </p>
                {availability.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-600 rounded-md"
                  >
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) =>
                        updateAvailabilitySlot(
                          i,
                          "dayOfWeek",
                          Number(e.target.value)
                        )
                      }
                      className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300"
                    >
                      {dayNames.map((name, idx) => (
                        <option key={idx} value={idx}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        updateAvailabilitySlot(i, "start", e.target.value)
                      }
                      className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300"
                    />
                    <span className="text-sm text-gray-500">-</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        updateAvailabilitySlot(i, "end", e.target.value)
                      }
                      className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(i)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAvailabilitySlot}
                  className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600 mt-1"
                >
                  <FiPlus size={14} />
                  Agregar horario
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Activo" />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  handleProcess={setIsActive}
                  processOption={isActive}
                />
              </div>
            </div>
          </div>

          <DrawerButton
            id={id}
            title="Veterinario"
            isSubmitting={isSubmitting}
          />
        </form>
      </Scrollbars>
    </>
  );
};

export default VeterinarianDrawer;
