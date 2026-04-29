"use client";


import {useEffect,useState} from "react"
import {useRouter} from "next/navigation"

export default function ProtectedRoute({children}:{children:React.ReactNode}){
    const router = useRouter();
    const[validando,setValidando]=useState(true)
    useEffect(()=>{
        const token =localStorage.getItem("token")
        if(!token){
            router.replace('/login');
            return
        }
        setValidando(false)
    },[router])
    return <>{children}</>
}