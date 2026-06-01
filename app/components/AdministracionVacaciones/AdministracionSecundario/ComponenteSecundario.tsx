"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { Solicitud } from "@/src/types/schemas";


export default function ComponenteSecundario() {
  const { token } = useAuth();
  const params = useParams();

  const id = params.id as string;

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarSolicitud = async () => {
      if (!token) {
        setError("No hay token. Inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          setError("No autorizado. Tu sesión expiró o no tienes permisos.");
          return;
        }

        if (res.status === 404) {
          setError("Solicitud no encontrada.");
          return;
        }

        if (!res.ok) {
          setError(`Error al cargar solicitud. Código: ${res.status}`);
          return;
        }

        const data = await res.json();
        setSolicitud(data);
      } catch {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitud();
  }, [id, token]);

  if (loading) {
    return (
      <main className="bg-gray-100 px-6 py-10">
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <p className="text-gray-600">Cargando solicitud...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-100 px-6 py-10">
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {error}
          </h1>

          <p className="text-gray-600">
            ID recibido:
            <span className="font-bold text-red-600 ml-2">
              {String(id)}
            </span>
          </p>
        </section>
      </main>
    );
  }

  if (!solicitud) {
    return null;
  }

  const empleado = solicitud.empleado;

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Detalle de solicitud de vacaciones
          </h1>

          <p className="text-gray-500">
            Información general del empleado y la solicitud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días solicitados</p>
            <h2 className="text-4xl font-bold text-[#009b63] mt-2">
              {solicitud.diastotales}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días disponibles</p>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {empleado?.saldodisponible}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días derecho</p>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {empleado?.diasderecho}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Estatus</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-3">
              {solicitud.estatus}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Información de la solicitud
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-500">Fecha inicio</p>
              <p className="font-semibold text-gray-800">
                {formatearFecha(solicitud.fechainicio)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha término</p>
              <p className="font-semibold text-gray-800">
                {formatearFecha(solicitud.fechatermino)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Motivo rechazo</p>
              <p className="font-semibold text-gray-800">
                {solicitud.motivorechazo ?? "Sin motivo de rechazo"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Información del empleado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-500">No. empleado</p>
              <p className="font-semibold text-gray-800">
                {empleado?.idempleado}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-gray-800">
                {empleado?.nombre}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Área</p>
              <p className="font-semibold text-gray-800">
                {empleado?.area}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Puesto</p>
              <p className="font-semibold text-gray-800">
                {empleado?.puesto}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha de ingreso</p>
              <p className="font-semibold text-gray-800">
                {formatearFecha(empleado?.fechaingreso!)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Antigüedad</p>
              <p className="font-semibold text-gray-800">
                {empleado?.antiguedad}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Semáforo</p>
              <p className="font-semibold text-gray-800">
                {empleado?.semaforo}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Acción sugerida</p>
              <p className="font-semibold text-gray-800">
                {empleado?.accionsugerida}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}