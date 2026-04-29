"use client";


import {useEffect,useState} from "react"
import {usePathname, useRouter} from "next/navigation"
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({children}:{children:React.ReactNode}){
    const router = useRouter();
    const[validando,setValidando]=useState(true)
    const { usuario } = useAuth();
     const pathname = usePathname();
    useEffect(()=>{
        const token =localStorage.getItem("token")
        if(!token || !usuario){
            router.replace('/login');
            return
        }
        if (usuario.actualizarpassword === true && pathname !== "/update-password") {
            router.replace("/update-password");
            return;
        }
        if (usuario.actualizarpassword === false && pathname === "/update-password") {
            router.replace("/");
            return;
        }
    setValidando(false)
    },[router,usuario, pathname])
    return <>{children}</>
}