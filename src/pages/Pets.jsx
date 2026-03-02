import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import NotFound from "@/components/table/NotFound";
import PetServices from "@/services/PetServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import { useAction } from "@/context/ActionContext";
import PetDrawer from "@/components/drawer/PetDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import PetTable from "@/components/pet/PetTable";
import AnimatedContent from "@/components/common/AnimatedContent";

const Pets = () => {
  const queryClient = useQueryClient();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    isCheckAll,
    toggleDrawer,
    handleSelectAll,
  } = useAction();
  const { title, handleDeleteMany } = useToggleDrawer();

  const [searchText, setSearchText] = useState("");

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: () => PetServices.getAllPets(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const filteredPets = (data || []).filter((pet) => {
    if (!searchText) return true;
    const name =
      pet?.name?.es || pet?.name?.en || Object.values(pet?.name || {})[0] || "";
    return name.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["pets"] });
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>Mascotas</PageTitle>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
          <Button
            disabled={selectedIds?.length < 1}
            onClick={() => handleDeleteMany(selectedIds)}
            variant="delete"
            className="w-full sm:w-auto"
          >
            <span className="mr-2">
              <FiTrash2 />
            </span>
            Eliminar
          </Button>
          <Button
            onClick={toggleDrawer}
            variant="create"
            className="w-full sm:w-auto"
          >
            <span className="mr-2">
              <FiPlus />
            </span>
            Agregar Mascota
          </Button>
        </div>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />
      <MainDrawer>
        <PetDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <div className="pb-5">
              <Input
                type="search"
                placeholder="Buscar mascota..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:max-w-xs"
              />
            </div>

            {loading ? (
              <TableLoading row={8} col={6} width={190} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">
                {error.message || "Error al cargar mascotas"}
              </span>
            ) : filteredPets?.length !== 0 ? (
              <TableContainer className="mb-4 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <CheckBox
                          type="checkbox"
                          name="selectAll"
                          id="selectAll"
                          isChecked={isCheckAll}
                          handleSelect={() => handleSelectAll(filteredPets)}
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Icono</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Publicado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <PetTable pets={filteredPets} />
                </Table>
              </TableContainer>
            ) : (
              <NotFound title="No se encontraron mascotas" />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Pets;
