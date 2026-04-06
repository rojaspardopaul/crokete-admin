import React from "react";
import { Input } from "@/components/ui/input";
import LabelArea from "@/components/form/selectOption/LabelArea";

const QuickInfoForm = ({ quickInfo, setQuickInfo }) => {
  const update = (field, value) => {
    setQuickInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <p className="text-xs text-gray-500 mb-6">
        Información rápida que se muestra como chips visibles sin necesidad de scroll. Texto libre para display.
      </p>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Mascota" />
        <div className="col-span-8 sm:col-span-4">
          <Input
            type="text"
            placeholder='Ej: Perro, Gato'
            value={quickInfo.pet || ""}
            onChange={(e) => update("pet", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Edad" />
        <div className="col-span-8 sm:col-span-4">
          <Input
            type="text"
            placeholder='Ej: Adulto, Cachorro, Senior'
            value={quickInfo.age || ""}
            onChange={(e) => update("age", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Tamaño" />
        <div className="col-span-8 sm:col-span-4">
          <Input
            type="text"
            placeholder='Ej: Mediano, Grande'
            value={quickInfo.size || ""}
            onChange={(e) => update("size", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Rango de peso" />
        <div className="col-span-8 sm:col-span-4">
          <Input
            type="text"
            placeholder='Ej: 11-25 kg'
            value={quickInfo.weightRange || ""}
            onChange={(e) => update("weightRange", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Destacado" />
        <div className="col-span-8 sm:col-span-4">
          <Input
            type="text"
            placeholder='Ej: Control de peso, Digestión sensible'
            value={quickInfo.highlight || ""}
            onChange={(e) => update("highlight", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickInfoForm;
