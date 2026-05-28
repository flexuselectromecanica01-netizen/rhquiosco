"use client";

import { useEffect, useRef, useState } from "react";

export default function AsistenciaFacial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bloqueoRef = useRef(false);

  const [mensaje, setMensaje] = useState("Preparando cámara...");
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);
  const [audioActivo, setAudioActivo] = useState(false);

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

            if (!bloqueoRef.current) {
              bloqueoRef.current = true;
              setAsistenciaRegistrada(true);
              setMensaje("Asistencia registrada");

              hablar("Asistencia registrada");

              /*
                Aquí después conectas con NestJS:

                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/asistencias`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    metodo: "FACIAL",
                    tipo: "ENTRADA",
                  }),
                });
              */

              setTimeout(() => {
                bloqueoRef.current = false;
                setAsistenciaRegistrada(false);
                setMensaje("Coloca tu rostro frente a la cámara");
              }, 5000);
            }
          } else {
            setRostroDetectado(false);

            if (!bloqueoRef.current) {
              setMensaje("No se detecta rostro");
            }
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
  }, [audioActivo]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">
          Registro de asistencia
        </h1>

        <p
          className={`mt-2 text-sm font-medium ${
            asistenciaRegistrada || rostroDetectado
              ? "text-emerald-600"
              : "text-gray-500"
          }`}
        >
          {mensaje}
        </p>

        <div
          className={`mt-6 overflow-hidden rounded-xl bg-black border-4 ${
            asistenciaRegistrada || rostroDetectado
              ? "border-emerald-500"
              : "border-transparent"
          }`}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full min-h-[240px] object-cover"
          />
        </div>

        <button
          onClick={() => {
            setAudioActivo(true);
            hablar("Audio activado");
          }}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {audioActivo ? "Audio activado" : "Activar audio"}
        </button>

        <div
          className={`mt-4 rounded-xl px-4 py-3 text-center font-semibold ${
            asistenciaRegistrada
              ? "bg-emerald-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {asistenciaRegistrada
            ? "✅ Asistencia registrada"
            : "Esperando rostro..."}
        </div>
      </section>
    </main>
  );
}