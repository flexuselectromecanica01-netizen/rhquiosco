"use client";

import { useEffect, useRef, useState } from "react";

export default function AsistenciaFacial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [mensaje, setMensaje] = useState("Preparando cámara...");
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [registrando, setRegistrando] = useState(false);

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
          if (!videoRef.current || registrando) return;

          const deteccion = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.5,
            })
          );

          if (deteccion) {
            setRostroDetectado(true);
            setMensaje("Rostro detectado");
          } else {
            setRostroDetectado(false);
            setMensaje("No se detecta rostro");
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

        setMensaje("No se pudo acceder a la cámara. Usa localhost o HTTPS.");
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
    };
  }, [registrando]);

  const registrarAsistencia = async () => {
    try {
      setRegistrando(true);
      setMensaje("Registrando asistencia...");

      /*
        Aquí después conectas con tu backend NestJS:

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/asistencias/facial`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metodo: "FACIAL",
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Error al registrar asistencia");
        }
      */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMensaje("Asistencia registrada correctamente");

      setTimeout(() => {
        setRegistrando(false);
        setMensaje("Coloca tu rostro frente a la cámara");
      }, 5000);
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo registrar la asistencia");
      setRegistrando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border">
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
            className="w-full min-h-[240px] object-cover"
          />
        </div>

        <button
          onClick={registrarAsistencia}
          disabled={!rostroDetectado || registrando}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {registrando ? "Registrando..." : "Registrar asistencia"}
        </button>
      </section>
    </main>
  );
}