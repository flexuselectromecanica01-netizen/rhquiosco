"use client";

import { useEffect, useRef, useState } from "react";

export default function AsistenciaFacial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mensaje, setMensaje] = useState("Preparando cámara...");

  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setMensaje("Coloca tu rostro frente a la cámara");
      } catch {
        setMensaje("No se pudo acceder a la cámara");
      }
    };

    iniciarCamara();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">
          Registro de asistencia
        </h1>

        <p className="mt-2 text-sm text-gray-500">{mensaje}</p>

        <div className="mt-6 overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full"
          />
        </div>

        <button className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700">
          Registrar asistencia
        </button>
      </section>
    </main>
  );
}