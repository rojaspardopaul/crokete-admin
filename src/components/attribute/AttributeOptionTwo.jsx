import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const AttributeOptionTwo = ({
  attributes,
  values,
  setValues,
  selectedValueClear,
}) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  // console.log('attributes in attribute option',attributes)

  const { showingTranslateValue } = useUtilsFunction();

  const handleSelectValue = (items) => {
    // setSelectedValueClear(false);
    setSelected(items);
    setValues({
      ...values,
      [attributes._id]: items?.map((el) => el._id),
    });
  };

  useEffect(() => {
    const options = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: showingTranslateValue(val?.name) || val?._id || "Sin nombre",
        value: val?._id,
      };
    });
    setAttributeOptions(options || []);
  }, [attributes?.variants]);

  useEffect(() => {
    if (selectedValueClear) {
      setSelected([]);
    }
  }, [selectedValueClear]);

  return (
    <div>
      <MultiSelect
        options={attributeOptions}
        value={selected}
        onChange={(v) => handleSelectValue(v)}
        labelledBy="Seleccionar"
        overrideStrings={{
          allItemsAreSelected: "Todos seleccionados",
          clearSearch: "Limpiar b\u00fasqueda",
          clearSelected: "Limpiar selecci\u00f3n",
          noOptions: "Sin opciones disponibles",
          search: "Buscar...",
          selectAll: "Seleccionar todo",
          selectAllFiltered: "Seleccionar todo (filtrado)",
          selectSomeItems: "Seleccionar valores...",
          create: "Crear",
        }}
      />
    </div>
  );
};

export default AttributeOptionTwo;
