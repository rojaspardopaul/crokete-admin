import React from "react";
import { Button } from "@/components/ui/button";
import LabelArea from "@/components/form/selectOption/LabelArea";

const ConsumptionGuideForm = ({ consumptionGuide, setConsumptionGuide }) => {
  const addRow = () => {
    setConsumptionGuide([
      ...consumptionGuide,
      { petWeight: "", dailyAmount: "", durationDays: "" },
    ]);
  };

  const removeRow = (index) => {
    setConsumptionGuide(consumptionGuide.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...consumptionGuide];
    updated[index] = { ...updated[index], [field]: parseFloat(value) || "" };
    setConsumptionGuide(updated);
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Guía de consumo" />
        <div className="col-span-8 sm:col-span-4">
          <p className="text-xs text-gray-500 mb-3">
            Tabla de duración estimada por peso de mascota. Se mostrará: &quot;Para perro de Xkg → dura Y días&quot;.
          </p>

          {consumptionGuide.length > 0 && (
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
              <span className="flex-1">Peso mascota (kg)</span>
              <span className="w-28">Cantidad diaria (g)</span>
              <span className="w-28">Duración (días)</span>
              <span className="w-8"></span>
            </div>
          )}

          {consumptionGuide.map((row, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder="Peso (kg)"
                min="0"
                step="0.5"
                value={row.petWeight || ""}
                onChange={(e) => updateRow(i, "petWeight", e.target.value)}
                className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="number"
                placeholder="g/día"
                min="0"
                value={row.dailyAmount || ""}
                onChange={(e) => updateRow(i, "dailyAmount", e.target.value)}
                className="border h-10 text-sm w-28 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="number"
                placeholder="Días"
                min="0"
                value={row.durationDays || ""}
                onChange={(e) => updateRow(i, "durationDays", e.target.value)}
                className="border h-10 text-sm w-28 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addRow} className="text-xs mt-1">
            + Agregar rango de peso
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionGuideForm;
