import React from "react";
import { Textarea } from "@/components/ui/textarea";
import LabelArea from "@/components/form/selectOption/LabelArea";

const IndicationsForm = ({
  indications,
  setIndications,
  warnings,
  setWarnings,
  dosage,
  setDosage,
  language,
}) => {
  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Indicaciones de uso" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Indicaciones de uso del medicamento o producto veterinario"
            rows="4"
            value={indications?.[language] || ""}
            onChange={(e) =>
              setIndications((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Advertencias" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Contraindicaciones y advertencias"
            rows="4"
            value={warnings?.[language] || ""}
            onChange={(e) =>
              setWarnings((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Dosificación" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Dosificación recomendada según peso o tipo de animal"
            rows="4"
            value={dosage?.[language] || ""}
            onChange={(e) =>
              setDosage((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default IndicationsForm;
