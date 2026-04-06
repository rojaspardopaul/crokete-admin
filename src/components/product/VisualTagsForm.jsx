import React from "react";
import LabelArea from "@/components/form/selectOption/LabelArea";

const VISUAL_TAGS = [
  { value: "new", label: "Nuevo", color: "bg-green-100 text-green-700" },
  { value: "bestseller", label: "Más vendido", color: "bg-amber-100 text-amber-700" },
  { value: "organic", label: "Orgánico", color: "bg-lime-100 text-lime-700" },
  { value: "grain_free", label: "Grain Free", color: "bg-blue-100 text-blue-700" },
  { value: "prescription", label: "Receta veterinaria", color: "bg-red-100 text-red-700" },
  { value: "eco", label: "Eco-friendly", color: "bg-emerald-100 text-emerald-700" },
  { value: "limited_edition", label: "Edición limitada", color: "bg-purple-100 text-purple-700" },
  { value: "vet_recommended", label: "Recomendado por veterinarios", color: "bg-teal-100 text-teal-700" },
  { value: "sale", label: "En oferta", color: "bg-orange-100 text-orange-700" },
];

const ICON_TAGS = [
  { value: "grain_free", label: "Libre de granos", icon: "🌾" },
  { value: "high_protein", label: "Alta proteína", icon: "💪" },
  { value: "vet_recommended", label: "Recomendado veterinario", icon: "🏥" },
  { value: "natural", label: "Natural", icon: "🍃" },
  { value: "hypoallergenic", label: "Hipoalergénico", icon: "🛡️" },
  { value: "low_fat", label: "Bajo en grasa", icon: "🥗" },
  { value: "organic", label: "Orgánico", icon: "🌿" },
  { value: "no_artificial", label: "Sin artificiales", icon: "🚫" },
  { value: "prebiotics", label: "Prebióticos", icon: "🦠" },
  { value: "omega_3_6", label: "Omega 3 y 6", icon: "🐟" },
  { value: "gluten_free", label: "Sin gluten", icon: "🌾" },
  { value: "sugar_free", label: "Sin azúcar", icon: "🍬" },
  { value: "sensitive_stomach", label: "Estómago sensible", icon: "🫧" },
  { value: "joint_support", label: "Soporte articular", icon: "🦴" },
  { value: "skin_coat", label: "Piel y pelo", icon: "✨" },
  { value: "dental_care", label: "Cuidado dental", icon: "🦷" },
  { value: "weight_control", label: "Control de peso", icon: "⚖️" },
  { value: "puppy_formula", label: "Fórmula cachorro", icon: "🐶" },
  { value: "pregnant_dog", label: "Perra gestante", icon: "🐕" },
  { value: "newborn_puppy", label: "Cachorro recién nacido", icon: "🍼" },
];

const TagCheckboxGroup = ({ label, description, options, selected, onChange, useIcon }) => (
  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
    <LabelArea label={label} />
    <div className="col-span-8 sm:col-span-4">
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                isSelected
                  ? useIcon
                    ? "bg-teal-50 border-teal-400 text-teal-700"
                    : opt.color + " border-current"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
              }`}
            >
              {useIcon && <span className="text-base">{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const VisualTagsForm = ({ visualTags, setVisualTags, iconTags, setIconTags }) => {
  return (
    <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
      <TagCheckboxGroup
        label="Tags visuales (Marketing)"
        description="Badges que aparecen sobre la imagen del producto para atraer atención."
        options={VISUAL_TAGS}
        selected={visualTags}
        onChange={setVisualTags}
        useIcon={false}
      />
      <TagCheckboxGroup
        label="Iconos técnicos"
        description="Iconos de atributos técnicos del producto que se muestran en el detalle."
        options={ICON_TAGS}
        selected={iconTags}
        onChange={setIconTags}
        useIcon={true}
      />
    </div>
  );
};

export default VisualTagsForm;
