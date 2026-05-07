"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { EmpleadoVacaciones } from "@/src/types/solicitudes";



export default function Vacaciones() {
  const [empleados, setEmpleados] = useState<EmpleadoVacaciones[]>([]);
  const [loading, setLoading] = useState(true);

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


  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800">Vacaciones</h1>

          <p className="mt-1 text-gray-500">
            Visualización de solicitudes de vacaciones.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Cargando información...</div>
        ) : solicitudes.length === 0 ? (
          <div className="p-6 text-gray-500">
            No se encontraron solicitudes.
          </div>
        ) : (
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
                {solicitudes.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
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
        )}
      </section>
    </main>
  );
}