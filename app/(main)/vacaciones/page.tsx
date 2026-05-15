"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import { formatearFecha } from "@/src/utils/formatearFecha";

registerLocale("es", es);

export default function Vacaciones() {
  const { usuario } = useAuth();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPeriodoAbierto, setModalPeriodoAbierto] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  
  const diasFestivos = [
    "2026-01-01",
    "2026-02-02",
    "2026-03-16",
    "2026-05-01",
    "2026-09-16",
    "2026-11-16",
    "2026-12-25",
  ];

  const convertirFechaLocal = (fecha: string) => {
    const [year, month, day] = fecha.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const generarPdfSolicitudes = () => {
  if (!usuario?.empleado) {
    toast.error("No hay información del empleado");
    return;
  }

  if (solicitudes.length === 0) {
    toast.error("No hay solicitudes para generar el PDF");
    return;
  }

  const doc = new jsPDF();

  const nombreEmpleado = usuario.empleado.nombre ?? "Sin información";
  const idEmpleado = usuario.empleado.idempleado ?? "Sin información";

  doc.setFontSize(16);
  doc.text("Solicitudes de vacaciones", 14, 18);

  doc.setFontSize(11);
  doc.text(`Empleado: ${nombreEmpleado}`, 14, 28);
  doc.text(`Número de empleado: ${idEmpleado}`, 14, 35);

  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${formatearFecha(new Date().toISOString())}`, 14, 42);

  autoTable(doc, {
    startY: 50,
    head: [["Fecha inicio", "Fecha término", "Días totales", "Estatus", "Motivo rechazo"]],
    body: solicitudes.map((solicitud) => [
      formatearFecha(solicitud.fechainicio),
      formatearFecha(solicitud.fechatermino),
      String(solicitud.diastotales),
      solicitud.estatus,
      solicitud.motivorechazo || "N/A",
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  doc.save(`solicitudes-vacaciones-${idEmpleado}.pdf`);
};

  const formatearFechaInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const obtenerFechaHoy = () => {
    return formatearFechaInput(new Date());
  };

  const obtenerSoloFecha = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const esFinDeSemana = (fecha: string) => {
    const date = convertirFechaLocal(fecha);
    const dia = date.getDay();

    return dia === 0 || dia === 6;
  };

  const esDiaFestivo = (fecha: string) => {
    return diasFestivos.includes(fecha);
  };

  const filtrarFechaPermitida = (date: Date) => {
    const fechaTexto = formatearFechaInput(date);
    const dia = date.getDay();

    const esSabadoODomingo = dia === 0 || dia === 6;
    const esFestivo = diasFestivos.includes(fechaTexto);

    return !esSabadoODomingo && !esFestivo;
  };

  const contarDiasHabiles = (inicio: string, termino: string) => {
    let contador = 0;

    const fechaActual = convertirFechaLocal(inicio);
    const fechaFinal = convertirFechaLocal(termino);

    while (fechaActual <= fechaFinal) {
      const fechaTexto = formatearFechaInput(fechaActual);

      if (!esFinDeSemana(fechaTexto) && !esDiaFestivo(fechaTexto)) {
        contador++;
      }

      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return contador;
  };

  console.log(usuario)

  const estaDentroDelPeriodoSolicitud = () => {
    const inicio = usuario?.empleado?.iniciocicloactual;
    const fin = usuario?.empleado?.fincicloactual;

    if (!inicio || !fin) return false;

    const hoy = obtenerSoloFecha(new Date());
    const fechaInicioSolicitud = obtenerSoloFecha(convertirFechaLocal(inicio));
    const fechaFinSolicitud = obtenerSoloFecha(convertirFechaLocal(fin));

    return hoy >= fechaInicioSolicitud && hoy <= fechaFinSolicitud;
  };

  const puedeSolicitarVacaciones = estaDentroDelPeriodoSolicitud();

  const fechaInicioCicloActual = usuario?.empleado?.iniciocicloactual ?? "";
  const fechaFinCicloActual = usuario?.empleado?.fincicloactual ?? "";

  const diasDisponibles = Number(
    usuario?.empleado?.saldodisponible ??
      usuario?.empleado?.diasderecho ??
      0
  );

  const tieneSaldoDisponible = diasDisponibles > 0;

  const puedeAbrirSolicitud =
    puedeSolicitarVacaciones && tieneSaldoDisponible;

  const diasSeleccionados =
    fechaInicio && fechaTermino
      ? contarDiasHabiles(fechaInicio, fechaTermino)
      : 0;

  const validarFecha = (fecha: string) => {
    const hoy = obtenerFechaHoy();

    if (!fecha) {
      return "Debes seleccionar una fecha.";
    }

    if (fecha < hoy) {
      return "No puedes seleccionar fechas pasadas.";
    }

    if (esFinDeSemana(fecha)) {
      return "No puedes seleccionar sábados ni domingos.";
    }

    if (esDiaFestivo(fecha)) {
      return "No puedes seleccionar días festivos.";
    }

    return null;
  };

  useEffect(() => {
    const hayModalAbierto = modalAbierto || modalPeriodoAbierto;

    if (hayModalAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalAbierto, modalPeriodoAbierto]);

  const abrirModalSolicitud = () => {
    if (!tieneSaldoDisponible) {
      toast.warning("No tienes saldo disponible para solicitar vacaciones.");
      return;
    }

    if (!puedeSolicitarVacaciones) {
      toast.warning(
        `Solo puedes hacer tu solicitud del ${formatearFecha(
          fechaInicioCicloActual
        )} al ${formatearFecha(fechaFinCicloActual)}.`
      );
      return;
    }

    setModalAbierto(true);
  };

  const abrirModalPeriodo = async () => {
    const token = localStorage.getItem("token");
    const idempleado = usuario?.empleado?.idempleado;

    if (!token) {
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    if (!idempleado) {
      toast.warning("No se encontró el número de empleado.");
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

      if (!res.ok) {
        toast.error(data.message || "Error al consultar las solicitudes");
        return;
      }

      setSolicitudes(data);
    } catch (error) {
      console.log(error);
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setCargandoSolicitudes(false);
    }
  };

  const enviarSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tieneSaldoDisponible) {
      toast.error("No tienes saldo disponible para solicitar vacaciones.");
      return;
    }

    if (!puedeSolicitarVacaciones) {
      toast.error("Ya no estás dentro del periodo permitido para solicitar.");
      return;
    }

    const errorFechaInicio = validarFecha(fechaInicio);
    const errorFechaTermino = validarFecha(fechaTermino);

    if (errorFechaInicio) {
      toast.error(`Fecha inicio: ${errorFechaInicio}`);
      return;
    }

    if (errorFechaTermino) {
      toast.error(`Fecha término: ${errorFechaTermino}`);
      return;
    }

    if (fechaTermino < fechaInicio) {
      toast.error("La fecha término no puede ser menor que la fecha inicio.");
      return;
    }

    const diasSolicitados = contarDiasHabiles(fechaInicio, fechaTermino);

    if (diasSolicitados <= 0) {
      toast.error("Debes seleccionar al menos un día hábil.");
      return;
    }

    if (diasSolicitados > diasDisponibles) {
      toast.error(
        `Solo tienes ${diasDisponibles} días disponibles. Estás solicitando ${diasSolicitados} días hábiles.`
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
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
        toast.error(data.message || "Error al enviar solicitud");
        return;
      }

      toast.success("Solicitud enviada correctamente");

      setModalAbierto(false);
      setFechaInicio("");
      setFechaTermino("");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo conectar con el servidor");
    }
  };

  return (
    <section className="bg-gray-100 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            Mis Vacaciones
          </h1>

          <div className="h-1 w-12 bg-emerald-600"></div>

          <p className="mt-6 text-gray-600">
            Consulta tu información de vacaciones y realiza una nueva solicitud.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
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
                  {usuario?.empleado?.saldodisponible ?? "Sin información"} Dias disponibles
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Fecha de ingreso</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado?.fechaingreso
                    ? formatearFecha(usuario.empleado.fechaingreso)
                    : "Sin información"}
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="mb-1 text-sm text-gray-500">Dias tomados</p>
                <p className="text-xl font-semibold text-gray-800">
                  {usuario?.empleado.diastomados}
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

          <div className="mt-12 flex flex-col items-center gap-3 md:items-end">
            {!tieneSaldoDisponible ? (
              <p className="text-center text-sm text-red-600 md:text-right">
                No tienes saldo disponible para solicitar vacaciones.
              </p>
            ) : !puedeSolicitarVacaciones ? (
              <p className="text-center text-sm text-red-600 md:text-right">
                Solo puedes hacer la solicitud del{" "}
                <span className="font-semibold">
                  {fechaInicioCicloActual
                    ? formatearFecha(fechaInicioCicloActual)
                    : "Sin información"}
                </span>{" "}
                al{" "}
                <span className="font-semibold">
                  {fechaFinCicloActual
                    ? formatearFecha(fechaFinCicloActual)
                    : "Sin información"}
                </span>
                .
              </p>
            ) : null}

            <button
              type="button"
              disabled={!puedeAbrirSolicitud}
              onClick={abrirModalSolicitud}
              className={`w-full rounded-xl px-6 py-4 text-base font-semibold shadow-sm transition sm:w-auto sm:px-8 sm:text-lg ${
                puedeAbrirSolicitud
                  ? "cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              Solicitud de Vacaciones
            </button>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm sm:px-6">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-visible rounded-2xl bg-white p-5 shadow-lg sm:p-8">
            <button
              type="button"
              onClick={() => {
                setModalAbierto(false);
                setFechaInicio("");
                setFechaTermino("");
              }}
              className="absolute right-4 top-4 cursor-pointer text-2xl leading-none text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="pr-8 text-xl font-bold text-gray-800 sm:text-2xl">
              Solicitud de Vacaciones
            </h2>

            <p className="mb-4 mt-2 text-sm text-gray-600 sm:text-base">
              Selecciona el periodo de tus vacaciones.
            </p>

            <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              <p>
                Días disponibles:{" "}
                <span className="font-bold">{diasDisponibles}</span>
              </p>

              <p>
                Fecha límite para hacer la solicitud:{" "}
                <span className="font-bold">
                  {fechaFinCicloActual
                    ? formatearFecha(fechaFinCicloActual)
                    : "Sin información"}
                </span>
              </p>

              {diasSeleccionados > 0 && (
                <p>
                  Días hábiles seleccionados:{" "}
                  <span className="font-bold">{diasSeleccionados}</span>
                </p>
              )}
            </div>

            <form onSubmit={enviarSolicitud} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fecha inicio
                </label>

                <div className="w-full [&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container]:w-full">
                  <DatePicker
                    selected={
                      fechaInicio ? convertirFechaLocal(fechaInicio) : null
                    }
                    onChange={(date: Date | null) => {
                      if (!date) return;

                      setFechaInicio(formatearFechaInput(date));
                      setFechaTermino("");
                    }}
                    minDate={convertirFechaLocal(obtenerFechaHoy())}
                    filterDate={filtrarFechaPermitida}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona fecha inicio"
                    calendarClassName="calendario-grande"
                    popperPlacement="bottom-start"
                    popperClassName="z-[9999]"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fecha término
                </label>

                <div className="w-full [&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container]:w-full">
                  <DatePicker
                    selected={
                      fechaTermino ? convertirFechaLocal(fechaTermino) : null
                    }
                    onChange={(date: Date | null) => {
                      if (!date) return;

                      const fecha = formatearFechaInput(date);

                      if (fechaInicio && fecha < fechaInicio) {
                        toast.error(
                          "La fecha término no puede ser menor que la fecha inicio."
                        );
                        return;
                      }

                      const diasSolicitados = contarDiasHabiles(
                        fechaInicio,
                        fecha
                      );

                      if (diasSolicitados > diasDisponibles) {
                        toast.error(
                          `Solo tienes ${diasDisponibles} días disponibles. Ese rango tiene ${diasSolicitados} días hábiles.`
                        );
                        return;
                      }

                      setFechaTermino(fecha);
                    }}
                    minDate={convertirFechaLocal(
                      fechaInicio || obtenerFechaHoy()
                    )}
                    filterDate={filtrarFechaPermitida}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona fecha término"
                    calendarClassName="calendario-grande"
                    popperPlacement="bottom-start"
                    popperClassName="z-[9999]"
                    disabled={!fechaInicio}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setModalAbierto(false);
                    setFechaInicio("");
                    setFechaTermino("");
                  }}
                  className="w-full cursor-pointer rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPeriodoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm sm:px-6">
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
                          {formatearFecha(solicitud.fechainicio)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Fecha término</p>
                        <p className="font-semibold text-gray-800">
                          {formatearFecha(solicitud.fechatermino)}
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
  <button
    type="button"
    onClick={generarPdfSolicitudes}
    disabled={cargandoSolicitudes || solicitudes.length === 0}
    className="cursor-pointer rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
  >
    Descargar PDF
  </button>

  <button
    type="button"
    onClick={() => setModalPeriodoAbierto(false)}
    className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
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