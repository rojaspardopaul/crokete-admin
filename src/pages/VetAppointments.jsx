import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
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

import { notifySuccess, notifyError } from "@/utils/toast";
import VetServices from "@/services/VetServices";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import VetAppointmentTable from "@/components/vet/VetAppointmentTable";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "requested", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "in_progress", label: "En Curso" },
  { value: "completed", label: "Completadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "cancelled", label: "Canceladas" },
  { value: "no_show", label: "No Asistió" },
];

const statusBadge = (status) => {
  const styles = {
    requested: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    no_show: "bg-orange-100 text-orange-700",
  };
  const labels = {
    requested: "Pendiente",
    approved: "Aprobada",
    confirmed: "Confirmada",
    in_progress: "En Curso",
    completed: "Completada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
    no_show: "No Asistió",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
        styles[status] || ""
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const VetAppointments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Stats
  const { data: stats } = useQuery({
    queryKey: ["vet-stats"],
    queryFn: () => VetServices.getStats(),
    staleTime: 60 * 1000,
  });

  // Appointments list
  const {
    data: apptData,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["vet-appointments", statusFilter],
    queryFn: () =>
      VetServices.getAllAppointments({
        status: statusFilter || undefined,
        limit: 50,
      }),
    staleTime: 30 * 1000,
  });

  const appointments = apptData?.appointments || [];

  const viewDetails = async (id) => {
    try {
      setDetailLoading(true);
      const data = await VetServices.getAppointment(id);
      setSelectedAppointment(data);
      setAdminNotes(data.adminNotes || "");
      setClinicalNotes(data.clinicalNotes || "");
      setDiagnosis(data.diagnosis || "");
      setRecommendations(data.recommendations || "");
    } catch (err) {
      notifyError("Error al cargar detalles");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (newStatus, extraData = {}) => {
    if (!selectedAppointment) return;

    // Confirmation for approve
    if (newStatus === "approved") {
      const confirmed = window.confirm(
        "¿Estás seguro de aprobar esta consulta? Se enviará una notificación al cliente con el enlace de videollamada."
      );
      if (!confirmed) return;
    }

    // For reject, open modal instead
    if (newStatus === "rejected" && !extraData.rejectionReason) {
      setShowRejectModal(true);
      return;
    }

    try {
      setUpdating(true);
      await VetServices.updateAppointmentStatus(selectedAppointment._id, {
        status: newStatus,
        note: adminNotes,
        adminNotes,
        ...extraData,
      });
      notifySuccess("Estado actualizado");
      // Refresh
      const updated = await VetServices.getAppointment(
        selectedAppointment._id
      );
      setSelectedAppointment(updated);
      queryClient.invalidateQueries(["vet-appointments"]);
      queryClient.invalidateQueries(["vet-stats"]);
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Error al actualizar estado"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      notifyError("Debes proporcionar un motivo de rechazo");
      return;
    }
    setShowRejectModal(false);
    await handleStatusChange("rejected", { rejectionReason });
    setRejectionReason("");
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;

    // Validate at least one field has content
    if (
      !clinicalNotes.trim() &&
      !diagnosis.trim() &&
      !recommendations.trim() &&
      !adminNotes.trim()
    ) {
      notifyError(
        "Debe completar al menos un campo (notas clínicas, diagnóstico o recomendaciones)"
      );
      return;
    }

    try {
      setUpdating(true);
      await VetServices.updateAppointmentNotes(selectedAppointment._id, {
        adminNotes,
        clinicalNotes,
        diagnosis,
        recommendations,
      });
      notifySuccess("Notas guardadas");
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Error al guardar notas"
      );
    } finally {
      setUpdating(false);
    }
  };

  const validTransitions = {
    requested: ["approved", "rejected"],
    approved: ["confirmed", "cancelled"],
    confirmed: ["in_progress", "cancelled", "no_show"],
    in_progress: ["completed"],
  };

  // ==========================================
  // DETAIL VIEW
  // ==========================================
  if (selectedAppointment) {
    const appt = selectedAppointment;
    const nextStatuses = validTransitions[appt.status] || [];

    return (
      <>
        <div className="flex items-center gap-4 py-4 lg:py-8">
          <button
            onClick={() => setSelectedAppointment(null)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiArrowLeft size={20} />
          </button>
          <PageTitle>Detalle de Consulta</PageTitle>
        </div>

        <AnimatedContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Appointment Info */}
            <Card className="shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Información de la Cita
                  </h3>
                  {statusBadge(appt.status)}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-xs">
                      {appt._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha:</span>
                    <span>{formatDate(appt.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duración:</span>
                    <span>{appt.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precio original:</span>
                    <span>${appt.originalPrice?.toFixed(2)}</span>
                  </div>
                  {appt.discountPercent > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Descuento:</span>
                      <span className="text-emerald-600">
                        {appt.discountPercent}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Precio final:</span>
                    <span>
                      {appt.finalPrice === 0
                        ? "GRATIS"
                        : `$${appt.finalPrice?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-gray-500">Motivo:</span>
                    <p className="mt-1">{appt.reason}</p>
                  </div>
                  {appt.symptoms?.length > 0 && (
                    <div>
                      <span className="text-gray-500">Síntomas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {appt.symptoms.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {appt.meetingUrl && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-500">Enlace videollamada:</span>
                      <a
                        href={appt.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-blue-600 hover:underline text-xs break-all"
                      >
                        {appt.meetingUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    👤 Cliente
                  </h4>
                  <p className="text-sm">
                    {appt.customer?.name} — {appt.customer?.email}
                  </p>
                  {appt.customer?.loyalty && (
                    <p className="text-xs text-gray-400 mt-1">
                      Gastado total: $
                      {appt.customer.loyalty.totalSpent?.toFixed(2)} | Tier:{" "}
                      {appt.customer.loyalty.tier}
                    </p>
                  )}
                </div>

                {/* Pet Info */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🐾 Mascota
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>{appt.customerPet?.name}</strong> (
                      {appt.customerPet?.species})
                    </p>
                    {appt.customerPet?.breed && (
                      <p>Raza: {appt.customerPet.breed}</p>
                    )}
                    {appt.customerPet?.age && (
                      <p>Edad: {appt.customerPet.age} meses</p>
                    )}
                    {appt.customerPet?.weight && (
                      <p>Peso: {appt.customerPet.weight} kg</p>
                    )}
                    {appt.customerPet?.notes && (
                      <p className="text-gray-500">
                        Notas: {appt.customerPet.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vet Info */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    👨‍⚕️ Veterinario
                  </h4>
                  <p className="text-sm">{appt.veterinarian?.name}</p>
                  <p className="text-xs text-gray-400">
                    {appt.veterinarian?.email}
                  </p>
                </div>

                {/* Status History */}
                {appt.statusHistory?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📋 Historial
                    </h4>
                    <div className="space-y-2">
                      {appt.statusHistory.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          {statusBadge(h.status)}
                          <span className="text-gray-400">
                            {formatDate(h.changedAt)}
                          </span>
                          {h.note && (
                            <span className="text-gray-500">
                              — {h.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right: Actions & Notes */}
            <div className="space-y-4">
              {/* Status Actions */}
              {nextStatuses.length > 0 && (
                <Card className="shadow-sm bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Cambiar Estado
                    </h3>
                    <div className="mb-3">
                      <label className="text-sm text-gray-500 block mb-1">
                        Nota (opcional)
                      </label>
                      <Input
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Nota para este cambio de estado..."
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses.map((s) => {
                        // Custom labels for buttons
                        const buttonLabels = {
                          approved: "Aprobar Consulta",
                          rejected: "Rechazar Consulta",
                          confirmed: "Confirmar Consulta",
                          cancelled: "Cancelar Consulta",
                          completed: "Marcar Completada",
                          in_progress: "Iniciar Consulta",
                          no_show: "No Asistió",
                        };
                        return (
                          <Button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            disabled={updating}
                            className={`text-sm ${
                              s === "approved" || s === "confirmed"
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : s === "rejected" || s === "cancelled"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : s === "completed"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-500 hover:bg-gray-600 text-white"
                            }`}
                          >
                            {buttonLabels[s] || s}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Clinical Notes */}
              <Card className="shadow-sm bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Notas Clínicas
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Notas clínicas
                      </label>
                      <textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-20"
                        placeholder="Observaciones durante la consulta..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Diagnóstico
                      </label>
                      <Input
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Diagnóstico..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Recomendaciones
                      </label>
                      <textarea
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-20"
                        placeholder="Recomendaciones para el paciente..."
                      />
                    </div>
                    <Button
                      onClick={handleSaveNotes}
                      disabled={updating}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {updating ? "Guardando..." : "Guardar Notas"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedContent>

        {/* Rejection Reason Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Rechazar Consulta
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Por favor, indica el motivo del rechazo. Este mensaje será
                visible para el cliente.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-24 mb-4"
                placeholder="Motivo del rechazo..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRejectConfirm}
                  disabled={updating || !rejectionReason.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {updating ? "Rechazando..." : "Confirmar Rechazo"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ==========================================
  // LIST VIEW
  // ==========================================
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4">
        <div className="min-w-0 flex-1">
          <PageTitle>Consultas Veterinarias</PageTitle>
        </div>
        <Button
          onClick={() => queryClient.invalidateQueries(["vet-appointments"])}
          variant="outline"
        >
          <FiRefreshCw className="mr-2" size={14} />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {stats.totalAppointments || 0}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingRequests || 0}
              </p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.todayAppointments || 0}
              </p>
              <p className="text-xs text-gray-500">Hoy</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {stats.statusBreakdown?.completed || 0}
              </p>
              <p className="text-xs text-gray-500">Completadas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                statusFilter === opt.value
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatedContent>
        <Card className="shadow-sm bg-white dark:bg-gray-800 rounded-lg mb-4">
          <CardContent className="p-5">
            {loading ? (
              <TableLoading row={8} col={8} width={190} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">
                {error.message || "Error al cargar consultas"}
              </span>
            ) : appointments.length > 0 ? (
              <TableContainer className="mb-4 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-center">Duración</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <VetAppointmentTable
                    appointments={appointments}
                    onViewDetails={viewDetails}
                  />
                </Table>
              </TableContainer>
            ) : (
              <NotFound title="No hay consultas veterinarias" />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default VetAppointments;
