"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export default function Vacaciones() {
  const { usuario } = useAuth();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPeriodoAbierto, setModalPeriodoAbierto] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");

  const abrirModalPeriodo = async () => {
    const token = localStorage.getItem("token");
    const idempleado = usuario?.empleado?.idempleado;

    if (!token) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    if (!idempleado) {
      alert("No se encontró el número de empleado.");
      return;
    }

    try {
      setSolicitudes([]);
      setCargandoSolicitudes(true);
      setModalPeriodoAbierto(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/empleado/${idempleado}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("Respuesta solicitudes:", data);

      if (!res.ok) {
        alert(data.message || "Error al consultar las solicitudes");
        return;
      }

      setSolicitudes(data);
    } catch (error) {
      console.log(error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setCargandoSolicitudes(false);
    }
  };

  const enviarSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fechainicio: fechaInicio,
            fechatermino: fechaTermino,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al enviar solicitud");
        return;
      }

      alert("Solicitud enviada correctamente");

      setModalAbierto(false);
      setFechaInicio("");
      setFechaTermino("");
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <section className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Título de página */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            Mis Vacaciones
          </h1>

          <div className="h-1 w-12 bg-emerald-600"></div>

          <p className="mt-6 text-gray-600">
            Consulta tu información de vacaciones y realiza una nueva solicitud.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Antigüedad</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.antiguedad ?? "Sin información"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">
                  Días que tiene derecho
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.diasderecho ?? "Sin información"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Saldo</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.saldodisponible ?? "Sin información"}
                </p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Fecha de ingreso</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.fechaingreso ?? "Sin información"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Vigencia</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.diasporvencer ?? "Sin información"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">
                  Último periodo de vacaciones
                </p>

                <button
                  type="button"
                  onClick={abrirModalPeriodo}
                  className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                >
                  Ver
                </button>
              </div>
            </div>
          </div>

          {/* Botón solicitud */}
          <div className="mt-12 flex justify-center md:justify-end">
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 sm:w-auto sm:px-8 sm:text-lg"
            >
              Solicitud de Vacaciones
            </button>
          </div>
        </div>
      </div>

      {/* Modal para crear solicitud */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-lg sm:p-8">
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              className="absolute right-4 top-4 cursor-pointer text-2xl leading-none text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="pr-8 text-xl font-bold text-gray-800 sm:text-2xl">
              Solicitud de Vacaciones
            </h2>

            <p className="mb-6 mt-2 text-sm text-gray-600 sm:text-base">
              Selecciona el periodo de tus vacaciones.
            </p>

            <form onSubmit={enviarSolicitud} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fecha inicio
                </label>

                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fecha término
                </label>

                <input
                  type="date"
                  value={fechaTermino}
                  onChange={(e) => setFechaTermino(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal solicitudes del empleado */}
      {modalPeriodoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-lg sm:p-8">
            <button
              type="button"
              onClick={() => setModalPeriodoAbierto(false)}
              className="absolute right-4 top-4 cursor-pointer text-2xl leading-none text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="pr-8 text-xl font-bold text-gray-800 sm:text-2xl">
              Solicitudes de vacaciones
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Empleado:{" "}
              <span className="font-semibold text-gray-800">
                {usuario?.empleado?.nombre ?? "Sin información"}
              </span>
            </p>

            <p className="text-sm text-gray-600">
              Número de empleado:{" "}
              <span className="font-semibold text-gray-800">
                {usuario?.empleado?.idempleado ?? "Sin información"}
              </span>
            </p>

            {cargandoSolicitudes ? (
              <p className="mt-6 text-gray-600">Cargando solicitudes...</p>
            ) : solicitudes.length === 0 ? (
              <p className="mt-6 rounded-xl bg-gray-100 p-4 text-gray-600">
                No hay solicitudes registradas.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <p className="text-sm text-gray-500">Días totales</p>
                        <p className="font-semibold text-gray-800">
                          {solicitud.diastotales}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Estatus</p>
                        <p className="font-semibold text-emerald-700">
                          {solicitud.estatus}
                        </p>
                      </div>
                    </div>

                    {solicitud.motivorechazo && (
                      <div className="mt-4 rounded-lg bg-red-50 p-3">
                        <p className="text-sm text-red-600">
                          Motivo de rechazo
                        </p>
                        <p className="font-medium text-red-700">
                          {solicitud.motivorechazo}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalPeriodoAbierto(false)}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}