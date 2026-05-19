"use client";

import { useAuth } from "@/app/context/AuthContext";
import { SolicitudEmpleadoVacaciones } from "@/src/types/schemas";
import { SolicitudTabla } from "@/src/types/solicitudes";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { Check, X, User, CalendarDays, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AutorizacionVacaciones() {
  const { usuario, token } = useAuth();

  const [solicitudes, setSolicitudes] = useState<SolicitudTabla[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const [filtroEstatus, setFiltroEstatus] = useState("PENDIENTE");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const obtenerSolicitudesMaestras = useCallback(async () => {
  if (!usuario?.bodega || !usuario?.linea || !token) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const params = new URLSearchParams({
      subrol: "MAESTRA",
      bodega: usuario.bodega,
      linea: usuario.linea,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/autorizacion?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: SolicitudEmpleadoVacaciones[] = await res.json();

    if (!res.ok) {
      console.warn("No se encontraron solicitudes:", data);
      setSolicitudes([]);
      return;
    }

    const solicitudesFormateadas: SolicitudTabla[] = data.flatMap((empleado) =>
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

    const hayPendientes = solicitudesFormateadas.some(
      (solicitud) => solicitud.estatus === "PENDIENTE"
    );

    setFiltroEstatus(hayPendientes ? "PENDIENTE" : "APROBADA");
    setPaginaActual(1);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
  } finally {
    setLoading(false);
  }
}, [usuario, token]);

  useEffect(() => {
    obtenerSolicitudesMaestras();
  }, [obtenerSolicitudesMaestras]);

  const aprobarSolicitud = async (id: number) => {
    if (!token) {
      toast.warning("Sesión expirada. Inicia sesión nuevamente.");
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
        toast.error(data.message || "Error al aprobar solicitud");
        return;
      }

      toast.success("Solicitud aprobada correctamente");
      await obtenerSolicitudesMaestras();
    } catch (error) {
      toast.warning("No se pudo conectar con el servidor");
    } finally {
      setProcesandoId(null);
    }
  };

  const rechazarSolicitud = async (id: number) => {
    if (!token) {
      toast.warning("Sesión expirada. Inicia sesión nuevamente.");
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
        toast.error(data.message || "Error al rechazar solicitud");
        return;
      }

      toast.success("Solicitud rechazada correctamente");
      await obtenerSolicitudesMaestras();
    } catch (error) {
      toast.warning("No se pudo conectar con el servidor");
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

      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((solicitud) => {
      const coincideEstatus =
        filtroEstatus === "TODAS" || solicitud.estatus === filtroEstatus;

      const busqueda = busquedaEmpleado.trim().toLowerCase();

      const coincideEmpleado =
        busqueda === "" ||
        solicitud.idempleado.toLowerCase().includes(busqueda);

      return coincideEstatus && coincideEmpleado;
    });
  }, [solicitudes, filtroEstatus, busquedaEmpleado]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(solicitudesFiltradas.length / registrosPorPagina)
  );

  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;

  const solicitudesPaginadas = solicitudesFiltradas.slice(
    indiceInicio,
    indiceFin
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstatus, busquedaEmpleado, registrosPorPagina]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const limpiarFiltros = () => {
    setBusquedaEmpleado("");

    const hayPendientes = solicitudes.some(
      (solicitud) => solicitud.estatus === "PENDIENTE"
    );

    setFiltroEstatus(hayPendientes ? "PENDIENTE" : "APROBADA");
    setPaginaActual(1);
  };

  return (
    <main className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Autorización de Vacaciones
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Lista de empleados que solicitaron vacaciones.
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
    <span className="text-gray-700">
      Área:{" "}
      <span className="font-semibold text-gray-900">
        {usuario?.empleado?.area ?? "Sin área"}
      </span>
    </span>

    <span className="rounded-full bg-emerald-50 px-4 py-1.5 font-semibold text-emerald-700">
      Bodega: {usuario?.bodega ?? "Sin bodega"}
    </span>

    <span className="rounded-full bg-blue-50 px-4 py-1.5 font-semibold text-blue-700">
      Línea: {usuario?.linea ?? "Sin línea"}
    </span>
  </div>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-gray-800">
                {solicitudesPaginadas.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-gray-800">
                {solicitudesFiltradas.length}
              </span>{" "}
              filtradas
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Buscar por número de empleado
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={busquedaEmpleado}
                  onChange={(e) =>
                    setBusquedaEmpleado(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Ej. 0001"
                  maxLength={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Filtrar por estatus
              </label>

              <select
                value={filtroEstatus}
                onChange={(e) => setFiltroEstatus(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
              >
                <option value="TODAS">Todas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="APROBADA">Aprobadas</option>
                <option value="RECHAZADA">Rechazadas</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Registros por página
              </label>

              <select
                value={registrosPorPagina}
                onChange={(e) => setRegistrosPorPagina(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Cargando solicitudes...</div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="p-6 text-gray-500">
            No hay solicitudes que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <>
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
                  {solicitudesPaginadas.map((solicitud) => {
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
                            <CalendarDays
                              size={18}
                              className="text-[#009b63]"
                            />
                            <span>
                              {formatearFecha(solicitud.fechaInicio)} al{" "}
                              {formatearFecha(solicitud.fechaFin)}
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
                              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Página{" "}
                <span className="font-semibold text-gray-800">
                  {paginaActual}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-gray-800">
                  {totalPaginas}
                </span>{" "}
                — Total filtrado:{" "}
                <span className="font-semibold text-gray-800">
                  {solicitudesFiltradas.length}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={paginaActual <= 1}
                  onClick={() => setPaginaActual((prev) => prev - 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => setPaginaActual((prev) => prev + 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}