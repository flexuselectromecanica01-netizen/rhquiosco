"use client";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

type SolicitudDetalle = {
  id: number;
  fechainicio: string;
  fechatermino: string;
  diastotales: number;
  estatus: string;
  motivorechazo: string | null;
  empleado: {
    id: number;
    idempleado: string;
    nombre: string;
    tipoempleado: string;
    area: string;
    puesto: string;
    fechaingreso: string;
    antiguedad: number;
    diasderecho: number;
    diastomados: number;
    saldodisponible: string;
    semaforo: string;
    accionsugerida: string;
  };
};

export default async function DetalleVacaciones({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`http://localhost:4008/api/solicitudes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="bg-gray-100 px-6 py-10">
        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Solicitud no encontrada
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

  const solicitud: SolicitudDetalle = await res.json();
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
              {empleado.saldodisponible}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Días derecho</p>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {empleado.diasderecho}
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
                {solicitud.fechainicio}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha término</p>
              <p className="font-semibold text-gray-800">
                {solicitud.fechatermino}
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
                {empleado.idempleado}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-gray-800">
                {empleado.nombre}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Área</p>
              <p className="font-semibold text-gray-800">
                {empleado.area}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Puesto</p>
              <p className="font-semibold text-gray-800">
                {empleado.puesto}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha de ingreso</p>
              <p className="font-semibold text-gray-800">
                {empleado.fechaingreso}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Antigüedad</p>
              <p className="font-semibold text-gray-800">
                {empleado.antiguedad}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Semáforo</p>
              <p className="font-semibold text-gray-800">
                {empleado.semaforo}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Acción sugerida</p>
              <p className="font-semibold text-gray-800">
                {empleado.accionsugerida}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}