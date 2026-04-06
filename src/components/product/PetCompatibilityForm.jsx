import React from "react";
import LabelArea from "@/components/form/selectOption/LabelArea";

const PET_TYPES = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "both", label: "Ambos" },
];

const AGE_RANGES = [
  { value: "puppy", label: "Cachorro" },
  { value: "adult", label: "Adulto" },
  { value: "senior", label: "Senior" },
  { value: "all", label: "Todas las edades" },
];

const SIZES = [
  { value: "mini", label: "Mini" },
  { value: "small", label: "Pequeño" },
  { value: "medium", label: "Mediano" },
  { value: "large", label: "Grande" },
  { value: "giant", label: "Gigante" },
  { value: "all", label: "Todos los tamaños" },
];

const SPECIAL_NEEDS = [
  { value: "sensitive_stomach", label: "Estómago sensible" },
  { value: "weight_control", label: "Control de peso" },
  { value: "urinary", label: "Urinario" },
  { value: "dental", label: "Dental" },
  { value: "skin_coat", label: "Piel y pelaje" },
  { value: "joint", label: "Articulaciones" },
  { value: "hypoallergenic", label: "Hipoalergénico" },
];

const ChipGroup = ({ label, options, selected, onChange }) => (
  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
    <LabelArea label={label} />
    <div className="col-span-8 sm:col-span-4">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter((v) => v !== opt.value));
                } else {
                  onChange([...selected, opt.value]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:border-teal-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const PetCompatibilityForm = ({ petCompatibility, setPetCompatibility }) => {
  const update = (field, value) => {
    setPetCompatibility((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <ChipGroup
        label="Tipo de mascota"
        options={PET_TYPES}
        selected={petCompatibility.petType || []}
        onChange={(v) => update("petType", v)}
      />
      <ChipGroup
        label="Rango de edad"
        options={AGE_RANGES}
        selected={petCompatibility.ageRange || []}
        onChange={(v) => update("ageRange", v)}
      />
      <ChipGroup
        label="Tamaño mascota"
        options={SIZES}
        selected={petCompatibility.size || []}
        onChange={(v) => update("size", v)}
      />
      <ChipGroup
        label="Necesidades especiales"
        options={SPECIAL_NEEDS}
        selected={petCompatibility.specialNeeds || []}
        onChange={(v) => update("specialNeeds", v)}
      />

      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <LabelArea label="Razas específicas" />
        <div className="col-span-8 sm:col-span-4">
          <input
            type="text"
            placeholder="Separar razas con comas (Ej: Labrador, Golden Retriever)"
            value={(petCompatibility.breed || []).join(", ")}
            onChange={(e) =>
              update(
                "breed",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 border-transparent focus:bg-white focus:border-gray-300 rounded-md px-3"
          />
        </div>
      </div>
    </div>
  );
};

export default PetCompatibilityForm;
