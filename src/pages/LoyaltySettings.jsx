import React, { useEffect, useState } from "react";
import {
  FiGift,
  FiStar,
  FiPlus,
  FiTrash2,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";
import { notifySuccess, notifyError } from "@/utils/toast";
import LoyaltyServices from "@/services/LoyaltyServices";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const LoyaltySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    enabled: true,
    pointsPerDollar: 1,
    pointValue: 0.1,
    pointsExpireDays: 365,
    minRedeemPoints: 100,
    maxRedeemPercent: 50,
    milestones: [],
    tierThresholds: { frecuente: 3, vip: 10 },
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await LoyaltyServices.getConfig();
      if (data) {
        setConfig({
          enabled: data.enabled ?? true,
          pointsPerDollar: data.pointsPerDollar ?? 1,
          pointValue: data.pointValue ?? 0.1,
          pointsExpireDays: data.pointsExpireDays ?? 365,
          minRedeemPoints: data.minRedeemPoints ?? 100,
          maxRedeemPercent: data.maxRedeemPercent ?? 50,
          milestones: data.milestones || [],
          tierThresholds: data.tierThresholds || { frecuente: 3, vip: 10 },
        });
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || "Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await LoyaltyServices.updateConfig(config);
      notifySuccess("Configuración de lealtad actualizada");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const addMilestone = () => {
    setConfig((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { orderCount: 0, discountPercent: 0, label: "" },
      ],
    }));
  };

  const removeMilestone = (index) => {
    setConfig((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const updateMilestone = (index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <img src={spinnerLoadingImage} alt="Loading" className="w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      <PageTitle>Programa de Lealtad</PageTitle>
      <AnimatedContent>
        <div className="w-full overflow-hidden border border-gray-200 rounded-lg mb-8 bg-white">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiGift className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Crokete Rewards
                  </h2>
                  <p className="text-sm text-gray-500">
                    Configura el programa de recompensas para tus clientes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-600">
                    {config.enabled ? "Activo" : "Inactivo"}
                  </span>
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      config.enabled ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        enabled: !prev.enabled,
                      }))
                    }
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        config.enabled ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Points Configuration */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiStar className="text-amber-500" />
                Configuración de Puntos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Puntos por $1 MXN
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={config.pointsPerDollar}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pointsPerDollar: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Cuántos puntos gana el cliente por cada peso gastado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Valor del punto (MXN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.pointValue}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pointValue: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Cuánto vale cada punto al canjear (ej: $0.10)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Expiración (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.pointsExpireDays}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pointsExpireDays: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Después de cuántos días expiran los puntos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mínimo para canjear
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.minRedeemPoints}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        minRedeemPoints: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Puntos mínimos para hacer un canje
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Máximo descuento (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.maxRedeemPercent}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        maxRedeemPercent: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    % máximo del pedido que se puede pagar con puntos
                  </p>
                </div>
              </div>
            </div>

            {/* Tier Thresholds */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Niveles de Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Pedidos para nivel "Frecuente"
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.tierThresholds?.frecuente || 3}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        tierThresholds: {
                          ...prev.tierThresholds,
                          frecuente: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Pedidos para nivel "VIP"
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.tierThresholds?.vip || 10}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        tierThresholds: {
                          ...prev.tierThresholds,
                          vip: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Hitos de Compra
                </h3>
                <button
                  onClick={addMilestone}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <FiPlus className="text-sm" />
                  Agregar hito
                </button>
              </div>
              {config.milestones.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-4 text-center">
                  No hay hitos configurados. Agrega uno para recompensar a tus
                  clientes frecuentes.
                </p>
              ) : (
                <div className="space-y-3">
                  {config.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            # de pedidos
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={milestone.orderCount}
                            onChange={(e) =>
                              updateMilestone(
                                index,
                                "orderCount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            % descuento
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={milestone.discountPercent}
                            onChange={(e) =>
                              updateMilestone(
                                index,
                                "discountPercent",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Etiqueta
                          </label>
                          <input
                            type="text"
                            value={milestone.label}
                            onChange={(e) =>
                              updateMilestone(index, "label", e.target.value)
                            }
                            placeholder="Ej: 3era compra - 5% descuento"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeMilestone(index)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                onClick={fetchConfig}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FiRefreshCw className="text-sm" />
                Recargar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="text-sm animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiSave className="text-sm" />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </>
  );
};

export default LoyaltySettings;
