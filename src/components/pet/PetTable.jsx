import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useAction } from "@/context/ActionContext";

const PetTable = ({ pets }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const { handleSelect, selectedIds } = useAction();

  return (
    <TableBody>
      {pets?.map((pet) => (
        <TableRow key={pet._id}>
          <TableCell>
            <CheckBox
              type="checkbox"
              name={pet?.name?.es || pet?._id}
              id={pet._id}
              handleSelect={() => handleSelect(pet._id)}
              isChecked={selectedIds?.includes(pet._id)}
            />
          </TableCell>
          <TableCell className="font-semibold uppercase text-xs">
            {pet?._id?.substring(20, 24)}
          </TableCell>
          <TableCell>
            <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 border border-gray-200">
              {pet?.icon ? (
                <AvatarImage src={pet?.icon} alt={showingTranslateValue(pet?.name)} />
              ) : (
                <AvatarFallback className="text-gray-500 text-lg">🐾</AvatarFallback>
              )}
            </Avatar>
          </TableCell>
          <TableCell className="font-medium text-sm">
            {showingTranslateValue(pet?.name)}
          </TableCell>
          <TableCell className="text-center">
            <ShowHideButton id={pet._id} pet status={pet.status} />
          </TableCell>
          <TableCell className="text-right">
            <EditDeleteButton
              id={pet?._id}
              title={showingTranslateValue(pet?.name)}
              handleUpdate={handleUpdate}
              handleModalOpen={handleModalOpen}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PetTable;
