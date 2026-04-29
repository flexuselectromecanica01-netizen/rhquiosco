"use client";


import {useEffect,useState} from "react"
import {usePathname, useRouter} from "next/navigation"
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({children}:{children:React.ReactNode}){
    const router = useRouter();
    const[validando,setValidando]=useState(true)
    const { usuario,loading,token } = useAuth();
     const pathname = usePathname();

    const rutaPorRol=(rol:string)=>{
        switch(rol.toLocaleLowerCase()){
            case "supervisor":
                return "/supervisor";
            case "administrador":
                return "/administracion"
            case "empleado":
                return "/"
            default:
                return "/"
        }
    }

    useEffect(()=>{
        if (loading) return;
        if(!token || !usuario){
            router.replace('/login');
            return
        }
        if (usuario.actualizarpassword === true && pathname !== "/update-password") {
            router.replace("/update-password");
            return;
        }
        if (usuario.actualizarpassword === false && pathname === "/update-password") {
            router.replace(rutaPorRol(usuario.rol));
            return;
        }
        if (usuario.actualizarpassword === false && pathname === "/") {
    const destino = rutaPorRol(usuario.rol);

    if (destino !== pathname) {
      router.replace(destino);
      return;
    }
  }
    setValidando(false)
    },[router,usuario, pathname])


    if (loading || validando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium">Validando sesión...</p>
      </div>
    );
  }
    return <>{children}</>
}