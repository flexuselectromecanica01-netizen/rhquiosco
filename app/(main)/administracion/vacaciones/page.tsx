"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { EmpleadoVacaciones } from "@/src/types/solicitudes";



export default function Vacaciones() {
  const [empleados, setEmpleados] = useState<EmpleadoVacaciones[]>([]);
  const [loading, setLoading] = useState(true);
  const [busquedaIdEmpleado, setBusquedaIdEmpleado] = useState("");
const [paginaActual, setPaginaActual] = useState(1);
const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/empleados`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message || "Error al obtener solicitudes");
          return;
        }

        setEmpleados(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, []);

  const solicitudes = empleados.flatMap((empleado) =>
    (empleado.solicitudes ?? []).map((solicitud) => ({
      ...solicitud,
      idempleado: empleado.idempleado,
      nombre: empleado.nombre,
    }))
  );

  const solicitudesFiltradas = solicitudes.filter((solicitud) =>
  solicitud.idempleado
    .toLowerCase()
    .includes(busquedaIdEmpleado.toLowerCase().trim())
);

const totalPaginas = Math.ceil(
  solicitudesFiltradas.length / registrosPorPagina
);

const indiceInicio = (paginaActual - 1) * registrosPorPagina;
const indiceFinal = indiceInicio + registrosPorPagina;

const solicitudesPaginadas = solicitudesFiltradas.slice(
  indiceInicio,
  indiceFinal
);

const cambiarBusqueda = (value: string) => {
  setBusquedaIdEmpleado(value.replace(/\D/g, ""));
  setPaginaActual(1);
};


  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800">Vacaciones</h1>

          <p className="mt-1 text-gray-500">
            Visualización de solicitudes de vacaciones.
          </p>
        </div>

        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        Buscar por ID empleado
      </label>

      <input
        type="text"
        value={busquedaIdEmpleado}
        maxLength={4}
        onChange={(e) => cambiarBusqueda(e.target.value)}
        placeholder="Ej. 0001"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        Solicitudes por página
      </label>

      <select
        value={registrosPorPagina}
        onChange={(e) => {
          setRegistrosPorPagina(Number(e.target.value));
          setPaginaActual(1);
        }}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>

    <button
      type="button"
      onClick={() => {
        setBusquedaIdEmpleado("");
        setPaginaActual(1);
      }}
      className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
    >
      Limpiar
    </button>
  </div>
</div>

        {loading ? (
  <div className="p-6 text-gray-500">Cargando información...</div>
) : solicitudesFiltradas.length === 0 ? (
  <div className="p-6 text-gray-500">
    No se encontraron solicitudes.
  </div>
) : (
  <>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      No:
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Nombre:
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Fecha Solicitud
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Fecha Inicio
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Fecha Término
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Días Totales
    </th>

    <th className="px-6 py-5 text-sm font-semibold text-gray-700">
      Estatus
    </th>

    <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700">
      Acción
    </th>
  </tr>
</thead>

        <tbody>
          {solicitudesPaginadas.map((solicitud) => (
            <tr
              key={solicitud.id}
              className="border-t border-gray-100 "
            >
              <td className="px-6 py-5 font-semibold text-gray-800">
                {solicitud.idempleado}
              </td>

              <td className="px-6 py-5 text-gray-700">
                {solicitud.nombre}
              </td>

              <td className="px-6 py-5 text-gray-700">
                {formatearFecha(solicitud.fechacreacion)}
              </td>

              <td className="px-6 py-5 text-gray-700">
                {formatearFecha(solicitud.fechainicio)}
              </td>

              <td className="px-6 py-5 text-gray-700">
                {formatearFecha(solicitud.fechatermino)}
              </td>

              <td className="px-6 py-5 text-gray-700">
                {solicitud.diastotales}
              </td>

              <td className="px-6 py-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    solicitud.estatus === "PENDIENTE"
                      ? "bg-yellow-100 text-yellow-700"
                      : solicitud.estatus === "APROBADA"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {solicitud.estatus}
                </span>
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-end">
                  <Link
                    href={`/administracion/vacaciones/${solicitud.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009b63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007f52]"
                  >
                    <Eye size={16} />
                    Ver
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Mostrando {solicitudesPaginadas.length} de{" "}
        {solicitudesFiltradas.length} solicitudes
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

        <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
          Página {paginaActual} de {totalPaginas || 1}
        </span>

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