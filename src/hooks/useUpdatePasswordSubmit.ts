"use client";

import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { updatePasswordRequest } from "../lib/login";



export type UpdatePasswordForm={
    password:string
    confirmPassword:string
}

export function useUpdatePasswordSubmit() {
  const { token, cargarUsuario } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    if (!token) {
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      router.replace("/login");
      return;
    }

    try {
      await updatePasswordRequest(token, data.password);

      await cargarUsuario(token);

      toast.success("Contraseña actualizada correctamente");
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor";

      toast.error(message);
    }
  };

  return {
    onSubmit,
  };
}