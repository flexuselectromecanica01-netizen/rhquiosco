"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Usuario={
    id:number
    idempleado:string
    nombre:string
    rol:string
    actualizarpassword:boolean
    empleado:{
      accionsugerida:string
      antiguedad:number
      area:string
      diasavencer:number
      diasderecho:number
      diasporvencer:number
      diastomados:0
      fechaingreso:string
      fechacicloactual:string
      id:number
      idempleado:string
      iniciocicloactual:string
      nombre:string
      proporcionaldevengado:string
      puesto:string
      saldodisponible:string
      semaforo:string
      tipoempleado:string
    }
}

type AuthContextType={
    usuario:Usuario | null
    token: string | null
     loading: boolean;
    login:(token:string)=>Promise<void>
    logout:()=>void
    cargarUsuario:(token:string)=>Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({children}:{children:React.ReactNode}){
    const[usuario,setUsuario]=useState<Usuario | null>(null)
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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

  const logout = () => {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem("token");
  };
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");

    if (tokenGuardado) {
      setToken(tokenGuardado);
      cargarUsuario(tokenGuardado);
    }else {
    setLoading(false);
    }
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