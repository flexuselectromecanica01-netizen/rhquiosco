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
};

type EmpleadoVacaciones = {
  id: number;
  idempleado: string;
  nombre: string;
  solicitudes: Solicitud[];
};

export default function Vacaciones() {
  const [empleados, setEmpleados] = useState<EmpleadoVacaciones[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerInformacion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vacaciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message || "Error al obtener información");
          return;
        }

        setEmpleados(data);
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
        ) : empleados.length === 0 ? (
          <div className="p-6 text-gray-500">No se encontró información.</div>
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

                  <th className="px-6 py-5 text-sm font-semibold text-gray-700 text-right">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {empleados.flatMap((empleado) =>
                  empleado.solicitudes.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-5 font-semibold text-gray-800">
                        {empleado.idempleado}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {empleado.nombre}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {solicitud.fechainicio}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {solicitud.fechatermino}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {solicitud.diastotales}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}