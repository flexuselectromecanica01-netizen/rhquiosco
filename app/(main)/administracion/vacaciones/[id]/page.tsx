type Props = {
  params: Promise<{
    id: string;
  }>;
};

const empleados = [
  {
    id: "1",
    nombre: "Juan Pérez",
    correo: "juan.perez@empresa.com",
    departamento: "Recursos Humanos",
    puesto: "Auxiliar RH",
    diasDisponibles: 12,
    diasTomados: 6,
    diasTotales: 18,
    fechaIngreso: "15/03/2022",
    jefeDirecto: "Laura Méndez",
    estatus: "Activo",
  },
  {
    id: "2",
    nombre: "María López",
    correo: "maria.lopez@empresa.com",
    departamento: "Finanzas",
    puesto: "Contadora",
    diasDisponibles: 8,
    diasTomados: 10,
    diasTotales: 18,
    fechaIngreso: "01/08/2021",
    jefeDirecto: "Roberto García",
    estatus: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos Ramírez",
    correo: "carlos.ramirez@empresa.com",
    departamento: "Sistemas",
    puesto: "Desarrollador",
    diasDisponibles: 15,
    diasTomados: 3,
    diasTotales: 18,
    fechaIngreso: "10/01/2023",
    jefeDirecto: "Ana Torres",
    estatus: "Activo",
  },
];

export default async function DetalleVacaciones({ params }: Props) {
  const { id } = await params;

  const empleado = empleados.find((empleado) => empleado.id === id);

  if (!empleado) {
    return (
      <main className="bg-gray-100 px-6 py-10">
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Empleado no encontrado
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

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Detalle de vacaciones
          </h1>

          <p className="text-gray-500">
            Información general del empleado y sus días de vacaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días disponibles</p>
            <h2 className="text-4xl font-bold text-[#009b63] mt-2">
              {empleado.diasDisponibles}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días tomados</p>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {empleado.diasTomados}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días totales</p>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {empleado.diasTotales}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Información del empleado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-500">ID</p>
              <p className="font-semibold text-gray-800">{empleado.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-gray-800">{empleado.nombre}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Correo</p>
              <p className="font-semibold text-gray-800">{empleado.correo}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Departamento</p>
              <p className="font-semibold text-gray-800">
                {empleado.departamento}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Puesto</p>
              <p className="font-semibold text-gray-800">{empleado.puesto}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha de ingreso</p>
              <p className="font-semibold text-gray-800">
                {empleado.fechaIngreso}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Jefe directo</p>
              <p className="font-semibold text-gray-800">
                {empleado.jefeDirecto}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estatus</p>
              <span className="inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                {empleado.estatus}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}