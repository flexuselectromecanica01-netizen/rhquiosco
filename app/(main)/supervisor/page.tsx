"use client";

import Link from "next/link";
import { CalendarCheck, Users } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function Supervisor() {
  const { usuario } = useAuth();

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Supervisor
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/supervisor/autorizacion-vacaciones"
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-8 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-[#009b63] group"
          >
            <CalendarCheck
              size={48}
              className="text-[#009b63] mb-4 group-hover:scale-110 transition"
              strokeWidth={1.8}
            />

            <span className="text-xl font-semibold text-gray-800">
              Autorización de Vacaciones
            </span>
          </Link>

          <Link
            href="/supervisor/empleados"
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-8 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-[#009b63] group"
          >
            <Users
              size={48}
              className="text-[#009b63] mb-4 group-hover:scale-110 transition"
              strokeWidth={1.8}
            />

            <span className="text-xl font-semibold text-gray-800">
              Empleados
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}