import { Check, X, User, CalendarDays } from "lucide-react";

export default function AutorizacionVacaciones() {
  const solicitudes = [
    {
      id: 1,
      empleado: "Juan Pérez",
      departamento: "Recursos Humanos",
      puesto: "Auxiliar RH",
      fechaInicio: "2025-02-10",
      fechaFin: "2025-02-14",
      diasSolicitados: 5,
      motivo: "Vacaciones familiares",
      estatus: "Pendiente",
    },
    {
      id: 2,
      empleado: "María López",
      departamento: "Finanzas",
      puesto: "Contadora",
      fechaInicio: "2025-03-03",
      fechaFin: "2025-03-07",
      diasSolicitados: 5,
      motivo: "Descanso personal",
      estatus: "Pendiente",
    },
    {
      id: 3,
      empleado: "Carlos Ramírez",
      departamento: "Sistemas",
      puesto: "Desarrollador",
      fechaInicio: "2025-04-15",
      fechaFin: "2025-04-18",
      diasSolicitados: 4,
      motivo: "Viaje familiar",
      estatus: "Pendiente",
    },
  ];

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            Autorización de Vacaciones
          </h1>

          <p className="text-gray-500 mt-1">
            Lista de empleados que solicitaron vacaciones.
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
                  Estatus
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#009b63]/10 text-[#009b63] flex items-center justify-center">
                        <User size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {solicitud.empleado}
                        </p>
                        <p className="text-sm text-gray-500">
                          Solicitud #{solicitud.id}
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
                        {solicitud.fechaInicio} al {solicitud.fechaFin}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {solicitud.diasSolicitados}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {solicitud.motivo}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                      {solicitud.estatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-[#009b63] text-white px-4 py-2 rounded-xl hover:bg-[#007f52] transition"
                      >
                        <Check size={18} />
                        Aprobar
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                      >
                        <X size={18} />
                        Rechazar
                      </button>
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