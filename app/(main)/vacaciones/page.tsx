"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export default function Vacaciones() {
  const { usuario, logout } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  console.log(usuario)

  const enviarSolicitud = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Fecha inicio:", fechaInicio);
    console.log("Fecha término:", fechaTermino);

    // Aquí puedes conectar tu API o lógica para enviar la solicitud

    setModalAbierto(false);
    setFechaInicio("");
    setFechaTermino("");
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
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.antiguedad}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">
                  Días que tiene derecho
                </p>
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.diasderecho}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Saldo</p>
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.saldodisponible}</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Fecha de ingreso</p>
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.fechaingreso}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Vigencia</p>
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.diasporvencer}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">
                  Último periodo de vacaciones
                </p>
                <p className="text-xl font-semibold text-gray-800">{usuario?.empleado.fechacicloactual}</p>
              </div>
            </div>
          </div>

          {/* Botón */}
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

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-lg sm:p-8">
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-700"
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
      
    </section>
  );
}