import React from "react";
import LabelArea from "@/components/form/selectOption/LabelArea";

const PackageInfoForm = ({ packageInfo, setPackageInfo }) => {
  const update = (field, value) => {
    setPackageInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <LabelArea label="Presentación / Paquete" />
      <div className="col-span-8 sm:col-span-4">
        <p className="text-xs text-gray-500 mb-2">
          Información del paquete (peso, volumen o piezas) para calcular el precio
          por unidad automáticamente. Para medicamentos usa mg, ml o l.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Contenido"
            step="0.01"
            min="0"
            value={packageInfo?.weight || ""}
            onChange={(e) => update("weight", parseFloat(e.target.value) || null)}
            className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
          />
          <select
            value={packageInfo?.unit || "kg"}
            onChange={(e) => update("unit", e.target.value)}
            className="border h-10 text-sm w-24 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-2"
          >
            <optgroup label="Peso">
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="mg">mg</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
            </optgroup>
            <optgroup label="Volumen">
              <option value="l">l</option>
              <option value="ml">ml</option>
            </optgroup>
            <optgroup label="Conteo">
              <option value="pieza">pieza</option>
            </optgroup>
          </select>
          <input
            type="number"
            placeholder="Porciones (opcional)"
            min="0"
            value={packageInfo?.servings || ""}
            onChange={(e) => update("servings", parseInt(e.target.value) || null)}
            className="border h-10 text-sm w-36 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageInfoForm;
