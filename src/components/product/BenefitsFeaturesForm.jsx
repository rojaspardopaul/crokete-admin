import React from "react";
import { Textarea } from "@/components/ui/textarea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import { Button } from "@/components/ui/button";

const BenefitsFeaturesForm = ({
  benefits,
  setBenefits,
  features,
  setFeatures,
  productHighlights,
  setProductHighlights,
  language,
}) => {
  const addHighlight = () => {
    if (productHighlights.length < 4) {
      setProductHighlights([...productHighlights, ""]);
    }
  };

  const removeHighlight = (index) => {
    setProductHighlights(productHighlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index, value) => {
    const updated = [...productHighlights];
    updated[index] = value;
    setProductHighlights(updated);
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Beneficios" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Describe los beneficios del producto (uno por línea con •)"
            rows="4"
            value={benefits?.[language] || ""}
            onChange={(e) =>
              setBenefits((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Características" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Describe las características del producto (uno por línea con •)"
            rows="4"
            value={features?.[language] || ""}
            onChange={(e) =>
              setFeatures((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Highlights rápidos" />
        <div className="col-span-8 sm:col-span-4">
          <p className="text-xs text-gray-500 mb-2">
            3-4 palabras clave que aparecen con ✓ antes del botón de compra (máx 4).
          </p>
          {productHighlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="text-teal-500 font-bold">✓</span>
              <input
                type="text"
                placeholder={`Highlight ${i + 1}`}
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
                className="border h-10 text-sm focus:outline-none flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {productHighlights.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={addHighlight}
              className="text-xs mt-1"
            >
              + Agregar highlight
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsFeaturesForm;
