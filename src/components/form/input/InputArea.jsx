import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input";

const InputArea = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  autoComplete,
  placeholder,
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...register(`${name}`, {
          required: required ? `${label} es requerido` : false,
        })}
        defaultValue={defaultValue}
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        className={isPassword ? "pr-10" : ""}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  );
};

export default InputArea;
