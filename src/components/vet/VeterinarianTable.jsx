import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import useToggleDrawer from "@/hooks/useToggleDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";

const statusBadge = (status) => {
  const styles = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200",
    inactive:
      "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200",
  };

  const labels = {
    active: "Activo",
    inactive: "Inactivo",
  };

  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
        styles[status] || styles.inactive
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const VeterinarianTable = ({ veterinarians }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <TableBody>
      {veterinarians?.map((vet) => (
        <TableRow key={vet._id}>
          <TableCell className="font-semibold uppercase text-xs">
            {vet?._id?.substring(20, 24)}
          </TableCell>
          <TableCell>
            <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 border border-gray-200">
              {vet?.image ? (
                <AvatarImage src={vet.image} alt={vet.name} />
              ) : (
                <AvatarFallback className="text-gray-500 text-lg">
                  👨‍⚕️
                </AvatarFallback>
              )}
            </Avatar>
          </TableCell>
          <TableCell className="font-medium text-sm">{vet.name}</TableCell>
          <TableCell className="text-sm text-gray-500">
            {vet.email}
          </TableCell>
          <TableCell className="text-sm">
            <div className="flex flex-wrap gap-1">
              {(vet.specialties || []).slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded dark:bg-blue-900 dark:text-blue-200"
                >
                  {s}
                </span>
              ))}
              {(vet.specialties || []).length > 3 && (
                <span className="text-xs text-gray-400">
                  +{vet.specialties.length - 3}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell className="text-center">
            {statusBadge(vet.status)}
          </TableCell>
          <TableCell className="text-right">
            <EditDeleteButton
              id={vet._id}
              title={vet.name}
              handleUpdate={handleUpdate}
              handleModalOpen={handleModalOpen}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default VeterinarianTable;
