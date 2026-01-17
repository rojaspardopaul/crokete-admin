import { Badge } from "@/components/ui/badge";

const Status = ({ status }) => {
  // console.log("status", status);

  return (
    <>
      <span className="font-serif">
        {(status === "pendiente" ||
          status === "Pendiente" ||
          status === "inactivo") && (
          <Badge variant="parked" className="capitalize">
            {status}
          </Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge variant="parked" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "procesando" || status === "Procesando") && (
          <Badge variant="unpublished" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "entregado" ||
          status === "Entregado" ||
          status === "activo") && (
          <Badge variant="success" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "cancelado" || status === "Cancelado") && (
          <Badge variant="error" className="capitalize">
            {status}
          </Badge>
        )}
      </span>
    </>
  );
};

export default Status;
