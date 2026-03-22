import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

//internal import
import OrderServices from "@/services/OrderServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_LABELS = {
  pedido: "Pedido",
  empaquetado: "Empaquetado",
  en_reparto: "En Reparto",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const SelectStatus = ({ id, order }) => {
  const queryClient = useQueryClient();
  const { setIsUpdate } = useContext(SidebarContext);
  const [pendingStatus, setPendingStatus] = useState(null);

  const confirmChangeStatus = () => {
    OrderServices.updateOrder(id, { status: pendingStatus })
      .then((res) => {
        notifySuccess(res.message);
        queryClient.invalidateQueries({
          queryKey: ["dashboardRecentOrder"],
          exact: false,
        });
        setIsUpdate(true);
        setPendingStatus(null);
      })
      .catch((err) => {
        notifyError(err.message);
        setPendingStatus(null);
      });
  };

  return (
    <>
      <Select
        onValueChange={(value) => setPendingStatus(value)}
        className="h-8"
      >
        <SelectTrigger className="h-8 capitalize">
          <SelectValue placeholder={STATUS_LABELS[order?.status] || order?.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pedido">Pedido</SelectItem>
          <SelectItem value="empaquetado">Empaquetado</SelectItem>
          <SelectItem value="en_reparto">En Reparto</SelectItem>
          <SelectItem value="entregado">Entregado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={!!pendingStatus} onOpenChange={(open) => { if (!open) setPendingStatus(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de cambiar el estado del pedido a{" "}
              <strong>{STATUS_LABELS[pendingStatus] || pendingStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingStatus(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmChangeStatus}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectStatus;
