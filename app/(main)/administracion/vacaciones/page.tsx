"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type Solicitud = {
  id: number;
  fechainicio: string;
  fechatermino: string;
  diastotales: number;
  estatus: string;
  motivorechazo: string | null;
};

type EmpleadoVacaciones = {
  id: number;
  idempleado: string;
  nombre: string;
  tipoempleado: string;
  area: string;
  puesto: string;
  fechaingreso: string;
  antiguedad: number;
  diasderecho: number;
  saldodisponible: string;
  solicitudes: Solicitud[];
};

export default function Vacaciones() {
  const [empleado, setEmpleado] = useState<EmpleadoVacaciones | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerInformacion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:4008/api/vacaciones/empleado/0102", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message || "Error al obtener información");
          return;
        }

        setEmpleado(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerInformacion();
  }, []);

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Vacaciones</h1>

          <p className="text-gray-500 mt-1">
            Visualización de solicitudes de vacaciones.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Cargando información...</div>
        ) : !empleado ? (
          <div className="p-6 text-gray-500">No se encontró información.</div>
        ) : empleado.solicitudes.length === 0 ? (
          <div className="p-6 text-gray-500">
            Este empleado no tiene solicitudes de vacaciones.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    No:
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Nombre:
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Fecha Inicio
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Fecha Término
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Días Totales
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Estatus
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right w-[140px]">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {empleado.solicitudes.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {empleado.idempleado}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {empleado.nombre}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {solicitud.fechainicio}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {solicitud.fechatermino}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {solicitud.diastotales}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        {solicitud.estatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Link
                          href={`/administracion/vacaciones/${solicitud.id}`}
                          className="inline-flex min-w-[90px] items-center justify-center gap-2 whitespace-nowrap bg-[#009b63] text-white px-4 py-2 rounded-xl hover:bg-[#007f52] transition"
                        >
                          <Eye size={18} />
                          <span>Ver</span>
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