import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { LoginForm } from "../types/solicitudes";

type LoginFunction=(token:string)=>Promise<void> | void

type LoginSubmitParams={
    router:AppRouterInstance
    login:LoginFunction
}


export function createLoginSubmit({router,login}:LoginSubmitParams):SubmitHandler<LoginForm>{
    return async(data)=>{
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempleado: data.idempleado,
          password: data.password,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.message || "Credenciales incorrectas");
        return;
      }

      await login(response.token);

      toast.success("Inicio de sesión correcto");

      if (response.usuario?.actualizarpassword) {
        router.push("/actualizar-password");
      } else {
        router.push("/");
      }
        } catch (error) {
            toast.error("No se pudo conectar con el servidor");
        }
    }
}


export async function updatePasswordRequest(token:string,password:string) {
     const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login/update-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al actualizar contraseña");
  }

  return data;
}