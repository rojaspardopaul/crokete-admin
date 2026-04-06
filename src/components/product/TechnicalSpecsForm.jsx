import React from "react";
import { Button } from "@/components/ui/button";
import LabelArea from "@/components/form/selectOption/LabelArea";

const TechnicalSpecsForm = ({ technicalSpecs, setTechnicalSpecs, language }) => {
  const addRow = () => {
    setTechnicalSpecs([
      ...technicalSpecs,
      { key: { [language]: "" }, value: { [language]: "" } },
    ]);
  };

  const removeRow = (index) => {
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, text) => {
    const updated = [...technicalSpecs];
    updated[index] = {
      ...updated[index],
      [field]: { ...updated[index][field], [language]: text },
    };
    setTechnicalSpecs(updated);
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Especificaciones técnicas" />
        <div className="col-span-8 sm:col-span-4">
          <p className="text-xs text-gray-500 mb-2">
            Pares clave-valor para accesorios (Ej: Material → Nylon, Peso → 200g).
          </p>
          {technicalSpecs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Especificación"
                value={spec.key?.[language] || ""}
                onChange={(e) => updateRow(i, "key", e.target.value)}
                className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="text"
                placeholder="Valor"
                value={spec.value?.[language] || ""}
                onChange={(e) => updateRow(i, "value", e.target.value)}
                className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
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
            + Agregar especificación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsForm;
