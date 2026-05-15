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

  const rutaPorRol = (rol: string, subrol?: string) => {
    const rolNormalizado = rol?.toLowerCase();
    const subrolNormalizado = subrol?.toLowerCase();

    if (rolNormalizado === "administrador") {
      return "/administracion";
    }

    if (rolNormalizado === "supervisor") {
      return "/supervisor";
    }

    if (
      rolNormalizado === "empleado" &&
      subrolNormalizado === "maestra"
    ) {
      return "/maestra-linea";
    }

    if (rolNormalizado === "empleado") {
      return "/";
    }

    return "/";
  };

  const puedeEntrarARuta = (
    pathname: string,
    rol: string,
    subrol?: string
  ) => {
    const rolNormalizado = rol?.toLowerCase();
    const subrolNormalizado = subrol?.toLowerCase();

    if (pathname === "/update-password") {
      return true;
    }

    if (rolNormalizado === "administrador") {
      return pathname.startsWith("/administracion");
    }

    if (rolNormalizado === "supervisor") {
      return pathname.startsWith("/supervisor");
    }

    if (
      rolNormalizado === "empleado" &&
      subrolNormalizado === "maestra"
    ) {
      return pathname.startsWith("/maestra-linea");
    }

    if (rolNormalizado === "empleado") {
      const rutasBloqueadas = [
        "/administracion",
        "/supervisor",
        "/maestra-linea",
      ];

      return !rutasBloqueadas.some((ruta) =>
        pathname.startsWith(ruta)
      );
    }

    return false;
  };

  useEffect(() => {
    if (loading) return;

    setValidando(true);

    const esRutaPublica = rutasPublicas.includes(pathname);

    if (esRutaPublica) {
      if (token && usuario) {
        router.replace(rutaPorRol(usuario.rol, usuario.subrol));
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

    if (
      usuario.actualizarpassword === true &&
      pathname !== "/update-password"
    ) {
      router.replace("/update-password");
      return;
    }

    if (
      usuario.actualizarpassword === false &&
      pathname === "/update-password"
    ) {
      router.replace(rutaPorRol(usuario.rol, usuario.subrol));
      return;
    }

    const tienePermiso = puedeEntrarARuta(
      pathname,
      usuario.rol,
      usuario.subrol
    );

    if (!tienePermiso) {
      router.replace(rutaPorRol(usuario.rol, usuario.subrol));
      return;
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