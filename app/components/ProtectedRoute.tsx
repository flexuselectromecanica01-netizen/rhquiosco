"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, loading, token } = useAuth();

  const [validando, setValidando] = useState(true);

  const rutasPublicas = ["/login"];

  const rutaPorRol = (rol: string) => {
    switch (rol.toLowerCase()) {
      case "supervisor":
        return "/supervisor";
      case "administrador":
        return "/administracion";
      case "empleado":
        return "/";
      default:
        return "/";
    }
  };

  useEffect(() => {
    if (loading) return;

    setValidando(true);

    const esRutaPublica = rutasPublicas.includes(pathname);

    if (esRutaPublica) {
      if (token && usuario) {
        router.replace(rutaPorRol(usuario.rol));
        return;
      }

      setValidando(false);
      return;
    }

    if (!token || !usuario) {
      router.replace("/login");
      setValidando(false);
      return;
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

    setValidando(false);
  }, [loading, token, usuario, pathname, router]);

  if (loading || validando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="font-medium text-gray-600">Validando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}