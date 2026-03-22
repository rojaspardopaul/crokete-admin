import { Badge } from "@/components/ui/badge";

const STATUS_LABELS = {
  pedido: "Pedido",
  empaquetado: "Empaquetado",
  en_reparto: "En Reparto",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const Status = ({ status }) => {
  const norm = status?.toLowerCase() || "";
  const label = STATUS_LABELS[norm] || status;

  return (
    <>
      <span className="font-serif">
        {(norm === "pedido" || norm === "inactivo") && (
          <Badge variant="parked" className="capitalize">
            {label}
          </Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge variant="parked" className="capitalize">
            {status}
          </Badge>
        )}
        {norm === "empaquetado" && (
          <Badge variant="unpublished" className="capitalize">
            {label}
          </Badge>
        )}
        {norm === "en_reparto" && (
          <Badge variant="unpublished" className="capitalize">
            {label}
          </Badge>
        )}
        {(norm === "entregado" || norm === "activo") && (
          <Badge variant="success" className="capitalize">
            {label}
          </Badge>
        )}
        {norm === "cancelado" && (
          <Badge variant="error" className="capitalize">
            {label}
          </Badge>
        )}
      </span>
    </>
  );
};

export default Status;
