import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useAction } from "@/context/ActionContext";

const BrandTable = ({ brands }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const { handleSelect, selectedIds } = useAction();

  return (
    <TableBody>
      {brands?.map((brand) => (
        <TableRow key={brand._id}>
          <TableCell>
            <CheckBox
              type="checkbox"
              name={brand?.name?.es || brand?._id}
              id={brand._id}
              handleSelect={() => handleSelect(brand._id)}
              isChecked={selectedIds?.includes(brand._id)}
            />
          </TableCell>
          <TableCell className="font-semibold uppercase text-xs">
            {brand?._id?.substring(20, 24)}
          </TableCell>
          <TableCell>
            <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 border border-gray-200">
              {brand?.image ? (
                <AvatarImage src={brand?.image} alt={showingTranslateValue(brand?.name)} />
              ) : (
                <AvatarFallback className="text-gray-500 text-lg">🏷️</AvatarFallback>
              )}
            </Avatar>
          </TableCell>
          <TableCell className="font-medium text-sm">
            {showingTranslateValue(brand?.name)}
          </TableCell>
          <TableCell className="text-center">
            <ShowHideButton id={brand._id} brand status={brand.status} />
          </TableCell>
          <TableCell className="text-right">
            <EditDeleteButton
              id={brand?._id}
              title={showingTranslateValue(brand?.name)}
              handleUpdate={handleUpdate}
              handleModalOpen={handleModalOpen}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default BrandTable;
