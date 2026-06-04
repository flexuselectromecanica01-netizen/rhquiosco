"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  LogIn,
  Utensils,
  RotateCcw,
  LogOut,
  Volume2,
  UserCheck,
  Link,
} from "lucide-react";
import Footer from "../components/Footer";
import Image from "next/image";

type TipoRegistro =
  | "entrada"
  | "salidaComida"
  | "entradaComida"
  | "salidaJornada";

type RegistroAsistencia = {
  entrada: string | null;
  salidaComida: string | null;
  entradaComida: string | null;
  salidaJornada: string | null;
};

type AccionManual = {
  tipo: TipoRegistro;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
};

const empleadoDetectado = {
  idempleado: "1466",
  nombre: "JUAN DIEGO TREJO SANDOVAL",
};

export default function AsistenciaFacial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bloqueoRef = useRef(false);

  const [mensaje, setMensaje] = useState("Preparando cámara...");
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [audioActivo, setAudioActivo] = useState(false);
  const [rostroRegistrado, setRostroRegistrado] = useState(false);
  const [idempleadoManual, setIdempleadoManual] = useState("");

  const [registro, setRegistro] = useState<RegistroAsistencia>({
    entrada: null,
    salidaComida: null,
    entradaComida: null,
    salidaJornada: null,
  });

  const accionesManuales: AccionManual[] = [
    {
      tipo: "entrada",
      titulo: "Entrada",
      descripcion: "Registrar entrada laboral",
      icono: <LogIn size={24} />,
    },
    {
      tipo: "salidaComida",
      titulo: "Salida comida",
      descripcion: "Registrar salida a comer",
      icono: <Utensils size={24} />,
    },
    {
      tipo: "entradaComida",
      titulo: "Entrada comida",
      descripcion: "Registrar regreso de comida",
      icono: <RotateCcw size={24} />,
    },
    {
      tipo: "salidaJornada",
      titulo: "Salida jornada",
      descripcion: "Registrar salida laboral",
      icono: <LogOut size={24} />,
    },
  ];

  const obtenerHoraActual = () => {
    return new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const hablar = (texto: string) => {
    if (!audioActivo) return;

    if (!("speechSynthesis" in window)) {
      console.warn("Este navegador no soporta síntesis de voz");
      return;
    }

    window.speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-MX";
    voz.rate = 1;
    voz.pitch = 1;
    voz.volume = 1;

    window.speechSynthesis.speak(voz);
  };

  const obtenerSiguienteRegistro = (): TipoRegistro | null => {
    if (!registro.entrada) return "entrada";
    if (!registro.salidaComida) return "salidaComida";
    if (!registro.entradaComida) return "entradaComida";
    if (!registro.salidaJornada) return "salidaJornada";

    return null;
  };

  const obtenerTextoRegistro = (tipo: TipoRegistro, hora: string) => {
    if (tipo === "entrada") {
      return `Entrada registrada con la hora ${hora}`;
    }

    if (tipo === "salidaComida") {
      return `Salida a comida registrada con la hora ${hora}`;
    }

    if (tipo === "entradaComida") {
      return `Entrada de comida registrada con la hora ${hora}`;
    }

    return `Salida de jornada laboral registrada con la hora ${hora}`;
  };

  const obtenerTituloRegistro = (tipo: TipoRegistro) => {
    if (tipo === "entrada") return "Entrada registrada";
    if (tipo === "salidaComida") return "Salida a comida registrada";
    if (tipo === "entradaComida") return "Entrada de comida registrada";
    return "Salida de jornada registrada";
  };

  const registrarRostro = () => {
    if (!rostroDetectado) {
      setMensaje("No se detecta rostro para registrar");
      hablar("No se detecta rostro");
      return;
    }

    setRostroRegistrado(true);
    setMensaje(
      `Rostro registrado correctamente: ${empleadoDetectado.nombre} - ${empleadoDetectado.idempleado}`
    );
    hablar(`Rostro registrado correctamente de ${empleadoDetectado.nombre}`);
  };

  const registrarAsistencia = ({
    tipo,
    idempleado,
    metodo,
  }: {
    tipo: TipoRegistro;
    idempleado?: string;
    metodo: "FACIAL" | "MANUAL";
  }) => {
    if (metodo === "MANUAL" && idempleadoManual.trim() === "") {
      setMensaje("Ingresa el ID empleado para registrar manualmente");
      hablar("Ingresa el ID empleado");
      return;
    }

    const hora = obtenerHoraActual();

    setRegistro((prev) => ({
      ...prev,
      [tipo]: hora,
    }));

    const texto = obtenerTextoRegistro(tipo, hora);
    const titulo = obtenerTituloRegistro(tipo);

    if (metodo === "FACIAL") {
      setMensaje(
        `✅ ${titulo} - ${hora} | ${empleadoDetectado.idempleado} - ${empleadoDetectado.nombre}`
      );

      hablar(`${texto}. ${empleadoDetectado.nombre}`);
    } else {
      setMensaje(`✅ ${titulo} - ${hora} | ID empleado: ${idempleado}`);

      hablar(texto);
    }

    /*
      Aquí después conectas con NestJS:

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asistencias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempleado,
          tipo,
          hora,
          metodo,
        }),
      });
    */
  };

  const registrarAutomaticamente = () => {
    if (bloqueoRef.current) return;

    const siguienteRegistro = obtenerSiguienteRegistro();

    if (!siguienteRegistro) {
      setMensaje(
        `La jornada de hoy ya está completa para ${empleadoDetectado.nombre}`
      );
      hablar(`La jornada de hoy ya está completa para ${empleadoDetectado.nombre}`);

      bloqueoRef.current = true;

      setTimeout(() => {
        bloqueoRef.current = false;
      }, 5000);

      return;
    }

    bloqueoRef.current = true;

    registrarAsistencia({
      tipo: siguienteRegistro,
      idempleado: empleadoDetectado.idempleado,
      metodo: "FACIAL",
    });

    setTimeout(() => {
      bloqueoRef.current = false;
      setMensaje("Coloca tu rostro frente a la cámara");
    }, 8000);
  };

  useEffect(() => {
    let activo = true;

    const iniciarCamaraYDetector = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setMensaje("Tu navegador no soporta acceso a cámara");
          return;
        }

        setMensaje("Cargando detector facial...");

        const faceapi = await import("face-api.js");

        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

        setMensaje("Solicitando permiso de cámara...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (!activo) return;

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setMensaje("Coloca tu rostro frente a la cámara");

        intervalRef.current = setInterval(async () => {
          if (!videoRef.current) return;

          const deteccion = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.5,
            })
          );

          if (deteccion) {
            setRostroDetectado(true);
            registrarAutomaticamente();
          } else {
            setRostroDetectado(false);

            if (!bloqueoRef.current) {
              setMensaje("No se detecta rostro");
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);

        if (error instanceof DOMException) {
          if (error.name === "NotAllowedError") {
            setMensaje("Permiso de cámara denegado");
            return;
          }

          if (error.name === "NotFoundError") {
            setMensaje("No se encontró ninguna cámara");
            return;
          }

          if (error.name === "NotReadableError") {
            setMensaje("La cámara está ocupada por otra aplicación");
            return;
          }
        }

        setMensaje("No se pudo acceder a la cámara");
      }
    };

    iniciarCamaraYDetector();

    return () => {
      activo = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [registro, audioActivo]);

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="w-full bg-[#24282c]/95 shadow-md">
  <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
    <Link href="/" className="flex items-center" aria-label="Ir al inicio">
      <Image
        src="/logo.png"
        alt="Flexus Electro"
        width={190}
        height={60}
        className="object-contain"
        priority
      />
    </Link>
  </div>
</header>
      <section className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Registro de asistencia
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Componente estático: al detectar rostro se identifica al empleado
            fijo y se registra la siguiente asistencia pendiente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p
              className={`text-sm font-semibold ${
                rostroDetectado ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {mensaje}
            </p>

            <div
              className={`mt-6 overflow-hidden rounded-2xl bg-black border-4 ${
                rostroDetectado ? "border-emerald-500" : "border-transparent"
              }`}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-[340px] w-full object-cover"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <UserCheck size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Persona identificada
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    {empleadoDetectado.nombre}
                  </h2>

                  <p className="text-sm text-gray-500">
                    ID empleado: {empleadoDetectado.idempleado}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setAudioActivo(true);
                  hablar("Audio activado");
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Volume2 size={18} />
                {audioActivo ? "Audio activado" : "Activar audio"}
              </button>

              <button
                onClick={registrarRostro}
                disabled={!rostroDetectado}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Camera size={18} />
                {rostroRegistrado ? "Rostro registrado" : "Registrar rostro"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Asistencia del día
            </h2>

            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-500">Empleado identificado</p>
              <p className="mt-1 font-bold text-gray-900">
                {empleadoDetectado.idempleado} - {empleadoDetectado.nombre}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-500">Entrada</span>
                <strong className="text-gray-900">
                  {registro.entrada ?? "Sin registrar"}
                </strong>
              </div>

              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-500">Salida comida</span>
                <strong className="text-gray-900">
                  {registro.salidaComida ?? "Sin registrar"}
                </strong>
              </div>

              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-500">Entrada comida</span>
                <strong className="text-gray-900">
                  {registro.entradaComida ?? "Sin registrar"}
                </strong>
              </div>

              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-500">Salida jornada</span>
                <strong className="text-gray-900">
                  {registro.salidaJornada ?? "Sin registrar"}
                </strong>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {rostroDetectado
                ? `Rostro detectado: ${empleadoDetectado.nombre}`
                : "Esperando rostro o registro manual."}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Registro manual
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Usa esta opción si el reconocimiento facial falla.
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <label className="text-sm font-semibold text-gray-700">
                ID empleado
              </label>

              <input
                value={idempleadoManual}
                onChange={(event) => setIdempleadoManual(event.target.value)}
                placeholder="Ej. 0102"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {accionesManuales.map((accion) => (
              <button
                key={accion.tipo}
                onClick={() =>
                  registrarAsistencia({
                    tipo: accion.tipo,
                    idempleado: idempleadoManual.trim(),
                    metodo: "MANUAL",
                  })
                }
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white transition group-hover:bg-emerald-700">
                  {accion.icono}
                </div>

                <h3 className="mt-8 text-xl font-bold text-gray-900">
                  {accion.titulo}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {accion.descripcion}
                </p>
              </button>
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}