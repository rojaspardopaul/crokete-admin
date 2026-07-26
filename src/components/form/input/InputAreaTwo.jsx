import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input";

/**
 * Campo de formulario. Cuando es de tipo `password` —claves de Stripe, secretos
 * de OAuth— añade un botón para revelar el valor.
 *
 * Mostrarlo no expone nada nuevo: el panel ya recibe estos valores del backend
 * para poder rellenar el formulario, y ese endpoint exige super admin. Lo que
 * faltaba era poder leerlos para saber cuál está configurado sin tener que
 * consultar la base de datos.
 */
const InputAreaTwo = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);
  const esSecreto = type === "password";

  const campo = (
    <Input
      {...register(`${name}`, {
        required: required ? `${label} is required!` : false,
      })}
      defaultValue={defaultValue}
      type={esSecreto && visible ? "text" : type}
      placeholder={placeholder}
      name={name}
      autoComplete="new-password"
      className={esSecreto ? "pr-10" : undefined}
    />
  );

  // El resto de formularios (unos diez) siguen recibiendo el input pelado: al
  // envolverlo siempre en un div se descolocaban los que lo colocan dentro de
  // un flex o un grid.
  if (!esSecreto) return campo;

  return (
    <div className="relative">
      {campo}
      <button
        type="button" // sin esto, el clic enviaría el formulario
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Ocultar" : "Mostrar"}
        aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
      >
        {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  );
};

export default InputAreaTwo;
