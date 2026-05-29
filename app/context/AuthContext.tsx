"use client"

import { EmpleadoAuthContext } from "@/src/types/schemas"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType={
    usuario:EmpleadoAuthContext | null
    token: string | null
     loading: boolean;
    login:(token:string)=>Promise<void>
    logout:()=>void
    cargarUsuario:(token:string)=>Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}:{children:React.ReactNode}){
    const[usuario,setUsuario]=useState<EmpleadoAuthContext | null>(null)
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const logout = () => {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem("token");
    setLoading(false);
  };
    const cargarUsuario = async (jwt: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      logout();
      return;
    }

    const data = await res.json();
    setUsuario(data);
  } catch (error) {
    logout();
  } finally {
    setLoading(false);
  }
};

const login = async (jwt: string) => {
  setLoading(true);
  setToken(jwt);
  localStorage.setItem("token", jwt);

  await cargarUsuario(jwt);
};

  
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");

    if (!tokenGuardado) {
  setUsuario(null);
  setToken(null);
  setLoading(false);
  return;
}

setToken(tokenGuardado);
cargarUsuario(tokenGuardado);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        login,
        logout,
        cargarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}