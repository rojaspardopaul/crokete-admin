// Configuración centralizada del proyecto
export const APP_CONFIG = {
  // Nombre de la tienda/proyecto
  SHOP_NAME: import.meta.env.VITE_APP_SHOP_NAME || "Crokete",
  
  // Otros valores por defecto
  DEFAULT_CURRENCY: "$",
  DEFAULT_LANGUAGE: "es",
};

export default APP_CONFIG;
