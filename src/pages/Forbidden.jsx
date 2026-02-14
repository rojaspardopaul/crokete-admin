import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-red-100 dark:bg-red-900">
          <FaExclamationTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          403
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Acceso Denegado
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          No tienes permisos para acceder a esta página. Si crees que esto es un error, 
          por favor contacta con el Super Administrador.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Volver al Dashboard
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          <p>Permisos requeridos: Super Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
