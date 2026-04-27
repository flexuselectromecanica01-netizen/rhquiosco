import Link from "next/link";
import { Eye } from "lucide-react";

export default function Vacaciones() {
  const empleados = [
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan.perez@empresa.com",
      departamento: "Recursos Humanos",
      puesto: "Auxiliar RH",
      diasDisponibles: 12,
    },
    {
      id: 2,
      nombre: "María López",
      correo: "maria.lopez@empresa.com",
      departamento: "Finanzas",
      puesto: "Contadora",
      diasDisponibles: 8,
    },
    {
      id: 3,
      nombre: "Carlos Ramírez",
      correo: "carlos.ramirez@empresa.com",
      departamento: "Sistemas",
      puesto: "Desarrollador",
      diasDisponibles: 15,
    },
  ];

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Vacaciones</h1>

          <p className="text-gray-500 mt-1">
            Visualización de empleados y días disponibles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Empleado
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Correo
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Departamento
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Puesto
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Días disponibles
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right w-[140px]">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {empleados.map((empleado) => (
                <tr
                  key={empleado.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {empleado.nombre}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {empleado.correo}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {empleado.departamento}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {empleado.puesto}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {empleado.diasDisponibles}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/administracion/vacaciones/${empleado.id}`}
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
      </section>
    </main>
  );
}