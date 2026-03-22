import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const statusBadge = (status) => {
  const styles = {
    requested:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200",
    approved:
      "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
    confirmed:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200",
    in_progress:
      "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200",
    completed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200",
    cancelled:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    no_show:
      "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200",
  };

  const labels = {
    requested: "Pendiente",
    approved: "Aprobada",
    confirmed: "Confirmada",
    in_progress: "En Curso",
    completed: "Completada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
    no_show: "No asistió",
  };

  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
        styles[status] || styles.requested
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const VetAppointmentTable = ({ appointments, onViewDetails }) => {
  return (
    <TableBody>
      {appointments?.map((appt) => (
        <TableRow
          key={appt._id}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => onViewDetails(appt._id)}
        >
          <TableCell className="font-semibold uppercase text-xs">
            {appt?._id?.substring(20, 24)}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {appt?.customer?.image ? (
                  <AvatarImage src={appt.customer.image} />
                ) : (
                  <AvatarFallback className="text-xs bg-blue-50 text-blue-600">
                    {appt?.customer?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {appt?.customer?.name || "—"}
                </p>
                <p className="text-xs text-gray-400">
                  {appt?.customer?.email || ""}
                </p>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-sm">
            🐾 {appt?.customerPet?.name || "—"}
            <span className="text-xs text-gray-400 ml-1">
              ({appt?.customerPet?.species || ""})
            </span>
          </TableCell>
          <TableCell className="text-sm">
            👨‍⚕️ {appt?.veterinarian?.name || "—"}
          </TableCell>
          <TableCell className="text-sm">
            {formatDate(appt.date)}
          </TableCell>
          <TableCell className="text-sm text-center">
            {appt.duration} min
          </TableCell>
          <TableCell className="text-sm text-right">
            {appt.finalPrice === 0 ? (
              <span className="text-emerald-600 font-semibold">Gratis</span>
            ) : (
              `$${appt.finalPrice?.toFixed(2)}`
            )}
          </TableCell>
          <TableCell className="text-center">
            {statusBadge(appt.status)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default VetAppointmentTable;
