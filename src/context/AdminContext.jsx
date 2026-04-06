import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';

export const AdminContext = createContext();

const getValidAdminInfo = () => {
  const raw = Cookies.get('adminInfo');
  if (!raw) return null;
  try {
    const info = JSON.parse(raw);
    if (info?.token) {
      const payload = JSON.parse(atob(info.token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        Cookies.remove('adminInfo');
        return null;
      }
    }
    return info;
  } catch {
    Cookies.remove('adminInfo');
    return null;
  }
};

const initialState = {
  adminInfo: getValidAdminInfo(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, adminInfo: action.payload };

    case 'USER_LOGOUT':
      return {
        ...state,
        adminInfo: null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
