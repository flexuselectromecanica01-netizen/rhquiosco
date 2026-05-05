"use client";

import { useAuth } from "@/app/context/AuthContext";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { Check, X, User, CalendarDays } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";



export default function AutorizacionVacaciones() {
  const { usuario, token } = useAuth();

  const [solicitudes, setSolicitudes] = useState<SolicitudTabla[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const obtenerSolicitudesPorArea = useCallback(async () => {
    if (!usuario?.empleado?.area || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const area = encodeURIComponent(usuario.empleado.area);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/area/${area}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: EmpleadoVacaciones[] = await res.json();
        console.log(data)


      if (!res.ok) {
        console.error(data);
        setSolicitudes([]);
        return;
      }

      const solicitudesFormateadas: SolicitudTabla[] = data.flatMap(
        (empleado) =>
          empleado.solicitudes.map((solicitud) => ({
            id: solicitud.id,
            empleado: empleado.nombre,
            idempleado: empleado.idempleado,
            fechaCreacion: solicitud.fechacreacion,
            departamento: empleado.area,
            puesto: empleado.puesto,
            fechaInicio: solicitud.fechainicio,
            fechaFin: solicitud.fechatermino,
            diasSolicitados: solicitud.diastotales,
            motivo: solicitud.motivorechazo ?? "Solicitud de vacaciones",
            estatus: solicitud.estatus,
          }))
      );

      setSolicitudes(solicitudesFormateadas);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    } finally {
      setLoading(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    obtenerSolicitudesPorArea();
  }, [obtenerSolicitudesPorArea]);


  const aprobarSolicitud = async (id: number) => {
    if (!token) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    try {
      setProcesandoId(id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}/aprobar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al aprobar solicitud");
        return;
      }

      alert("Solicitud aprobada correctamente");
      await obtenerSolicitudesPorArea();
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setProcesandoId(null);
    }
  };

  const rechazarSolicitud = async (id: number) => {
    if (!token) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    const motivo = prompt("Escribe el motivo del rechazo:");

    if (!motivo || motivo.trim().length === 0) {
      toast.warning("Debes escribir un motivo de rechazo");
      return;
    }

    try {
      setProcesandoId(id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}/rechazar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            motivorechazo: motivo.trim(),
          }),
        }
      );

      const data = await res.json();


      if (!res.ok) {
        alert(data.message || "Error al rechazar solicitud");
        return;
      }

      toast.success("Solicitud rechazada correctamente");
      await obtenerSolicitudesPorArea();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setProcesandoId(null);
    }
  };

  const claseEstatus = (estatus: string) => {
    switch (estatus) {
      case "APROBADA":
        return "bg-green-100 text-green-700";

      case "RECHAZADA":
        return "bg-red-100 text-red-700";

      case "CANCELADA":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };


  return (
    <main className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Autorización de Vacaciones
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Lista de empleados que solicitaron vacaciones.
          </p>

          <p className="mt-2 text-sm font-medium text-gray-600">
            Área: {usuario?.empleado?.area ?? "Sin área"}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Cargando solicitudes...</div>
        ) : solicitudes.length === 0 ? (
          <div className="p-6 text-gray-500">
            No hay solicitudes de vacaciones para esta área.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Empleado
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Departamento
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Puesto
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Fechas
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Días
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Motivo
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
  Fecha solicitud
</th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Estatus
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {solicitudes.map((solicitud) => {
                  const esPendiente = solicitud.estatus === "PENDIENTE";
                  const procesando = procesandoId === solicitud.id;

                  return (
                    <tr
                      key={solicitud.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009b63]/10 text-[#009b63]">
                            <User size={20} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {solicitud.empleado}
                            </p>

                            <p className="text-sm text-gray-500">
                              No. {solicitud.idempleado} · Solicitud #
                              {solicitud.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {solicitud.departamento}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {solicitud.puesto}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={18} className="text-[#009b63]" />
                          <span>
                            {formatearFecha(solicitud.fechaInicio)} al {formatearFecha(solicitud.fechaFin)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {solicitud.diasSolicitados}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {solicitud.motivo}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
  {formatearFecha(solicitud.fechaCreacion)}
</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${claseEstatus(
                            solicitud.estatus
                          )}`}
                        >
                          {solicitud.estatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={!esPendiente || procesando}
                            onClick={() => aprobarSolicitud(solicitud.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#009b63] px-4 py-2 text-white transition hover:bg-[#007f52] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check size={18} />
                            {procesando ? "Procesando..." : "Aprobar"}
                          </button>

                          <button
                            type="button"
                            disabled={!esPendiente || procesando}
                            onClick={() => rechazarSolicitud(solicitud.id)}
                            className="inline-flex items-center gap-2  rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <X size={18} />
                            Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}