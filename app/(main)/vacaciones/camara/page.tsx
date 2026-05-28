"use client";

import { useEffect, useRef, useState } from "react";

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

export default function AsistenciaFacial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [mensaje, setMensaje] = useState("Preparando cámara...");
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [audioActivo, setAudioActivo] = useState(false);
  const [rostroRegistrado, setRostroRegistrado] = useState(false);

  const [registro, setRegistro] = useState<RegistroAsistencia>({
    entrada: null,
    salidaComida: null,
    entradaComida: null,
    salidaJornada: null,
  });

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

  const registrarRostro = () => {
    if (!rostroDetectado) {
      setMensaje("No se detecta rostro para registrar");
      hablar("No se detecta rostro");
      return;
    }

    setRostroRegistrado(true);
    setMensaje("Rostro registrado correctamente");
    hablar("Rostro registrado correctamente");

    /*
      Aquí después puedes guardar el descriptor facial del empleado.

      Ejemplo futuro:
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/biometrico-facial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempleado: "0102",
          descriptorFacial: descriptor,
        }),
      });
    */
  };

  const registrarAsistencia = (tipo: TipoRegistro) => {
    if (!rostroDetectado) {
      setMensaje("No se detecta rostro");
      hablar("No se detecta rostro");
      return;
    }

    const hora = obtenerHoraActual();

    setRegistro((prev) => ({
      ...prev,
      [tipo]: hora,
    }));

    let texto = "";

    if (tipo === "entrada") {
      texto = `Entrada registrada con la hora ${hora}`;
    }

    if (tipo === "salidaComida") {
      texto = `Salida a comida registrada con la hora ${hora}`;
    }

    if (tipo === "entradaComida") {
      texto = `Entrada de comida registrada con la hora ${hora}`;
    }

    if (tipo === "salidaJornada") {
      texto = `Salida de jornada laboral registrada con la hora ${hora}`;
    }

    setMensaje(`✅ Asistencia registrada - ${hora}`);
    hablar(texto);

    /*
      Aquí después conectas con NestJS:

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asistencias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempleado: "0102",
          tipo,
          hora,
          metodo: "FACIAL",
        }),
      });
    */
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
          } else {
            setRostroDetectado(false);
          }
        }, 800);
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
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">
          Registro de asistencia
        </h1>

        <p
          className={`mt-2 text-sm font-medium ${
            rostroDetectado ? "text-emerald-600" : "text-gray-500"
          }`}
        >
          {mensaje}
        </p>

        <div
          className={`mt-6 overflow-hidden rounded-xl bg-black border-4 ${
            rostroDetectado ? "border-emerald-500" : "border-transparent"
          }`}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full min-h-[260px] object-cover"
          />
        </div>

        <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
          {rostroDetectado ? (
            <span className="text-emerald-600">Rostro detectado</span>
          ) : (
            <span>No se detecta rostro</span>
          )}
        </div>

        <button
          onClick={() => {
            setAudioActivo(true);
            hablar("Audio activado");
          }}
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {audioActivo ? "Audio activado" : "Activar audio"}
        </button>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={registrarRostro}
            disabled={!rostroDetectado}
            className="rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {rostroRegistrado ? "Rostro registrado" : "Registrar rostro"}
          </button>

          <button
            onClick={() => registrarAsistencia("entrada")}
            disabled={!rostroDetectado}
            className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Registrar entrada
          </button>

          <button
            onClick={() => registrarAsistencia("salidaComida")}
            disabled={!rostroDetectado}
            className="rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Registrar salida comida
          </button>

          <button
            onClick={() => registrarAsistencia("entradaComida")}
            disabled={!rostroDetectado}
            className="rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Registrar entrada comida
          </button>

          <button
            onClick={() => registrarAsistencia("salidaJornada")}
            disabled={!rostroDetectado}
            className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:col-span-2"
          >
            Registrar salida jornada laboral
          </button>
        </div>

        <div className="mt-6 rounded-xl border bg-white p-4">
          <h2 className="text-lg font-bold text-gray-900">
            Asistencia del día
          </h2>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span>Entrada:</span>
              <strong>{registro.entrada ?? "Sin registrar"}</strong>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Salida comida:</span>
              <strong>{registro.salidaComida ?? "Sin registrar"}</strong>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Entrada comida:</span>
              <strong>{registro.entradaComida ?? "Sin registrar"}</strong>
            </div>

            <div className="flex justify-between">
              <span>Salida jornada laboral:</span>
              <strong>{registro.salidaJornada ?? "Sin registrar"}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}