import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LabelArea from "@/components/form/selectOption/LabelArea";

const NutritionForm = ({
  ingredients,
  setIngredients,
  nutritionTable,
  setNutritionTable,
  feedingGuide,
  setFeedingGuide,
  keyFacts,
  setKeyFacts,
  language,
}) => {
  // ── Guaranteed Analysis rows ──
  const analysis = nutritionTable?.guaranteedAnalysis || [];

  const addAnalysisRow = () => {
    setNutritionTable((prev) => ({
      ...prev,
      guaranteedAnalysis: [
        ...(prev?.guaranteedAnalysis || []),
        { nutrient: "", value: "", unit: "%" },
      ],
    }));
  };

  const removeAnalysisRow = (index) => {
    setNutritionTable((prev) => ({
      ...prev,
      guaranteedAnalysis: prev.guaranteedAnalysis.filter((_, i) => i !== index),
    }));
  };

  const updateAnalysisRow = (index, field, value) => {
    setNutritionTable((prev) => ({
      ...prev,
      guaranteedAnalysis: prev.guaranteedAnalysis.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  // ── Key Facts rows ──
  const addKeyFact = () => {
    if (keyFacts.length < 5) {
      setKeyFacts([...keyFacts, { label: "", value: "" }]);
    }
  };

  const removeKeyFact = (index) => {
    setKeyFacts(keyFacts.filter((_, i) => i !== index));
  };

  const updateKeyFact = (index, field, value) => {
    const updated = [...keyFacts];
    updated[index] = { ...updated[index], [field]: value };
    setKeyFacts(updated);
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Ingredientes" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Lista de ingredientes del producto"
            rows="4"
            value={ingredients?.[language] || ""}
            onChange={(e) =>
              setIngredients((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Tabla nutricional" />
        <div className="col-span-8 sm:col-span-4">
          <p className="text-xs text-gray-500 mb-2">Análisis garantizado</p>
          {analysis.map((row, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Nutriente"
                value={row.nutrient || ""}
                onChange={(e) => updateAnalysisRow(i, "nutrient", e.target.value)}
                className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="text"
                placeholder="Valor"
                value={row.value || ""}
                onChange={(e) => updateAnalysisRow(i, "value", e.target.value)}
                className="border h-10 text-sm w-20 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="text"
                placeholder="%"
                value={row.unit || ""}
                onChange={(e) => updateAnalysisRow(i, "unit", e.target.value)}
                className="border h-10 text-sm w-16 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <button
                type="button"
                onClick={() => removeAnalysisRow(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAnalysisRow} className="text-xs mt-1">
            + Agregar nutriente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Calorías" />
        <div className="col-span-8 sm:col-span-4">
          <input
            type="text"
            placeholder="Ej: 3,500 kcal/kg"
            value={nutritionTable?.calories || ""}
            onChange={(e) =>
              setNutritionTable((prev) => ({
                ...prev,
                calories: e.target.value,
              }))
            }
            className="border h-10 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Calorías por kg (numérico)" />
        <div className="col-span-8 sm:col-span-4">
          <input
            type="number"
            placeholder="Ej: 3500"
            value={nutritionTable?.caloriesPerKg || ""}
            onChange={(e) =>
              setNutritionTable((prev) => ({
                ...prev,
                caloriesPerKg: e.target.value ? Number(e.target.value) : "",
              }))
            }
            className="border h-10 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
          />
          <p className="text-xs text-gray-400 mt-1">Valor numérico en kcal/kg para la calculadora de raciones</p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Guía de alimentación" />
        <div className="col-span-8 sm:col-span-4">
          <Textarea
            className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500"
            placeholder="Guía de alimentación según peso del animal"
            rows="3"
            value={feedingGuide?.[language] || ""}
            onChange={(e) =>
              setFeedingGuide((prev) => ({
                ...prev,
                [language]: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Datos clave (Key Facts)" />
        <div className="col-span-8 sm:col-span-4">
          <p className="text-xs text-gray-500 mb-2">
            Datos resumidos que se muestran como pills arriba (máx 5).
          </p>
          {keyFacts.map((fact, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Etiqueta"
                value={fact.label || ""}
                onChange={(e) => updateKeyFact(i, "label", e.target.value)}
                className="border h-10 text-sm flex-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <input
                type="text"
                placeholder="Valor"
                value={fact.value || ""}
                onChange={(e) => updateKeyFact(i, "value", e.target.value)}
                className="border h-10 text-sm w-28 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
              />
              <button
                type="button"
                onClick={() => removeKeyFact(i)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {keyFacts.length < 5 && (
            <Button type="button" variant="outline" onClick={addKeyFact} className="text-xs mt-1">
              + Agregar dato clave
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionForm;
