import React, { useEffect, useState } from "react";
import {
  FiSettings,
  FiSave,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
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

import { notifySuccess, notifyError } from "@/utils/toast";
import VetServices from "@/services/VetServices";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import VeterinarianDrawer from "@/components/drawer/VeterinarianDrawer";
import VeterinarianTable from "@/components/vet/VeterinarianTable";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { useAction } from "@/context/ActionContext";

const VetSettings = () => {
  const queryClient = useQueryClient();
  const { open, setOpen, selectedId, toggleDrawer } = useAction();
  const { title } = useToggleDrawer();

  // ==========================================
  // CONFIG STATE
  // ==========================================
  const [configLoading, setConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("config"); // config | vets
  const [config, setConfig] = useState({
    enabled: false,
    durations: [],
    discountTiers: [],
    freeThreshold: 0,
    advanceBookingDays: 30,
    minBookingHoursAhead: 24,
    videoPlatform: "jitsi",
    workingHours: { start: "09:00", end: "18:00" },
    workingDays: [1, 2, 3, 4, 5],
    cancellationHoursLimit: 12,
    maxDailyConsultations: 20,
    customerInstructions: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setConfigLoading(true);
      const data = await VetServices.getConfig();
      if (data) {
        setConfig({
          enabled: data.enabled ?? false,
          durations: data.durations || [],
          discountTiers: data.discountTiers || [],
          freeThreshold: data.freeThreshold ?? 0,
          advanceBookingDays: data.advanceBookingDays ?? 30,
          minBookingHoursAhead: data.minBookingHoursAhead ?? 24,
          videoPlatform: data.videoPlatform || "jitsi",
          workingHours: data.workingHours || { start: "09:00", end: "18:00" },
          workingDays: data.workingDays || [1, 2, 3, 4, 5],
          cancellationHoursLimit: data.cancellationHoursLimit ?? 12,
          maxDailyConsultations: data.maxDailyConsultations ?? 20,
          customerInstructions: data.customerInstructions || "",
        });
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Error al cargar configuración"
      );
    } finally {
      setConfigLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await VetServices.updateConfig(config);
      notifySuccess("Configuración veterinaria actualizada");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // Duration management
  const addDuration = () => {
    setConfig((prev) => ({
      ...prev,
      durations: [
        ...prev.durations,
        { minutes: 30, label: "30 minutos", price: 350 },
      ],
    }));
  };

  const removeDuration = (index) => {
    setConfig((prev) => ({
      ...prev,
      durations: prev.durations.filter((_, i) => i !== index),
    }));
  };

  const updateDuration = (index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      durations: prev.durations.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      ),
    }));
  };

  // Discount tier management
  const addDiscountTier = () => {
    setConfig((prev) => ({
      ...prev,
      discountTiers: [
        ...prev.discountTiers,
        { minSpent: 0, discountPercent: 0, label: "" },
      ],
    }));
  };

  const removeDiscountTier = (index) => {
    setConfig((prev) => ({
      ...prev,
      discountTiers: prev.discountTiers.filter((_, i) => i !== index),
    }));
  };

  const updateDiscountTier = (index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      discountTiers: prev.discountTiers.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };

  const dayNames = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ];

  const toggleDay = (day) => {
    setConfig((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort(),
    }));
  };

  // ==========================================
  // VETS QUERY
  // ==========================================
  const {
    data: vetsData,
    error: vetsError,
    isLoading: vetsLoading,
  } = useQuery({
    queryKey: ["veterinarians"],
    queryFn: () => VetServices.getAllVeterinarians(),
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === "vets",
  });

  const [searchText, setSearchText] = useState("");
  const filteredVets = (vetsData?.vets || []).filter((vet) => {
    if (!searchText) return true;
    return (
      vet.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      vet.email?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  if (configLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <img src={spinnerLoadingImage} alt="Loading" className="w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4">
        <div className="min-w-0 flex-1">
          <PageTitle>Consulta Veterinaria</PageTitle>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "config"
              ? "bg-white dark:bg-gray-800 text-emerald-600 border-b-2 border-emerald-500"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiSettings className="inline mr-1" size={14} />
          Configuración
        </button>
        <button
          onClick={() => setActiveTab("vets")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === "vets"
              ? "bg-white dark:bg-gray-800 text-emerald-600 border-b-2 border-emerald-500"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700"
          }`}
        >
          👨‍⚕️ Veterinarios
        </button>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
      />
      <MainDrawer>
        <VeterinarianDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        {activeTab === "config" && (
          <Card className="shadow-sm bg-white dark:bg-gray-800 rounded-lg mb-4">
            <CardContent className="p-6">
              {/* Feature Toggle */}
              <div className="flex items-center justify-between mb-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Servicio de Consulta Veterinaria
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {config.enabled
                      ? "El servicio está habilitado y visible para los clientes"
                      : "El servicio está deshabilitado — no se muestra en la tienda"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      enabled: !prev.enabled,
                    }))
                  }
                  className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    config.enabled ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                      config.enabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Duration Options */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Opciones de Duración y Precio
                  </h4>
                  <button
                    onClick={addDuration}
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <FiPlus size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {config.durations.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Minutos
                        </label>
                        <Input
                          type="number"
                          value={d.minutes}
                          onChange={(e) =>
                            updateDuration(i, "minutes", Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Etiqueta
                        </label>
                        <Input
                          type="text"
                          value={d.label}
                          onChange={(e) =>
                            updateDuration(i, "label", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Precio (MXN)
                        </label>
                        <Input
                          type="number"
                          value={d.price}
                          onChange={(e) =>
                            updateDuration(i, "price", Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                      <button
                        onClick={() => removeDuration(i)}
                        className="mt-4 p-2 text-red-400 hover:text-red-600"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Tiers */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Descuentos por Compras Acumuladas
                  </h4>
                  <button
                    onClick={addDiscountTier}
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <FiPlus size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {config.discountTiers.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Mínimo gastado ($)
                        </label>
                        <Input
                          type="number"
                          value={t.minSpent}
                          onChange={(e) =>
                            updateDiscountTier(
                              i,
                              "minSpent",
                              Number(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Descuento (%)
                        </label>
                        <Input
                          type="number"
                          value={t.discountPercent}
                          onChange={(e) =>
                            updateDiscountTier(
                              i,
                              "discountPercent",
                              Number(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                          Etiqueta
                        </label>
                        <Input
                          type="text"
                          value={t.label}
                          onChange={(e) =>
                            updateDiscountTier(i, "label", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <button
                        onClick={() => removeDiscountTier(i)}
                        className="mt-4 p-2 text-red-400 hover:text-red-600"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Consulta Gratis desde ($)
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    0 = desactivado. Clientes con compras acumuladas mayores a
                    este monto obtienen consulta gratis.
                  </p>
                  <Input
                    type="number"
                    value={config.freeThreshold}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        freeThreshold: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Máx. Consultas por Día
                  </label>
                  <Input
                    type="number"
                    value={config.maxDailyConsultations}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        maxDailyConsultations: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Días de anticipación máx.
                  </label>
                  <Input
                    type="number"
                    value={config.advanceBookingDays}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        advanceBookingDays: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Horas mínimas de anticipación
                  </label>
                  <Input
                    type="number"
                    value={config.minBookingHoursAhead}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        minBookingHoursAhead: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Horas límite cancelación
                  </label>
                  <Input
                    type="number"
                    value={config.cancellationHoursLimit}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        cancellationHoursLimit: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Hora de inicio
                  </label>
                  <Input
                    type="time"
                    value={config.workingHours.start}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          start: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Hora de fin
                  </label>
                  <Input
                    type="time"
                    value={config.workingHours.end}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          end: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Working Days */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Días de atención
                </label>
                <div className="flex gap-2 flex-wrap">
                  {dayNames.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        config.workingDays.includes(idx)
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Plataforma de Video
                  </label>
                  <select
                    value={config.videoPlatform}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        videoPlatform: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="jitsi">Jitsi Meet (gratuito)</option>
                    <option value="google_meet">Google Meet</option>
                  </select>
                </div>
              </div>

              {/* Customer Instructions */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Instrucciones para el Cliente
                </label>
                <textarea
                  value={config.customerInstructions}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      customerInstructions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-24"
                  placeholder="Instrucciones que verá el cliente al agendar una consulta..."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={fetchConfig}
                  variant="outline"
                  disabled={saving}
                >
                  <FiRefreshCw
                    className={`mr-2 ${saving ? "animate-spin" : ""}`}
                    size={14}
                  />
                  Recargar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <FiSave className="mr-2" size={14} />
                  {saving ? "Guardando..." : "Guardar Configuración"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "vets" && (
          <>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Button
                onClick={toggleDrawer}
                variant="create"
                className="w-full sm:w-auto"
              >
                <FiPlus className="mr-2" />
                Agregar Veterinario
              </Button>
            </div>

            <Card className="shadow-sm bg-white dark:bg-gray-800 rounded-lg mb-4">
              <CardContent className="p-5">
                <div className="pb-5">
                  <Input
                    type="search"
                    placeholder="Buscar veterinario..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full sm:max-w-xs"
                  />
                </div>

                {vetsLoading ? (
                  <TableLoading row={5} col={7} width={190} height={20} />
                ) : vetsError ? (
                  <span className="text-center mx-auto text-red-500">
                    {vetsError.message || "Error al cargar veterinarios"}
                  </span>
                ) : filteredVets.length > 0 ? (
                  <TableContainer className="mb-4 rounded-b-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Foto</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Especialidades</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                          <TableHead className="text-right">
                            Acciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <VeterinarianTable veterinarians={filteredVets} />
                    </Table>
                  </TableContainer>
                ) : (
                  <NotFound title="No se encontraron veterinarios" />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </AnimatedContent>
    </>
  );
};

export default VetSettings;
