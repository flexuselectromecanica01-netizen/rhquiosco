"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCircle, LogOut, KeyRound } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="w-full bg-[#24282c]/95 shadow-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
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

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 text-white hover:text-[#009b63] transition cursor-pointer"
            aria-label="Usuario"
          >
            <UserCircle size={34} strokeWidth={1.8} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  No: 1416
                </p>
                <p className="text-xs text-gray-500">
                  Juan Diego Trejo Sandoval
                </p>
              </div>

              <Link
                href="/update-password"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <KeyRound size={18} />
                Cambiar contraseña
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpenMenu(false);
                  console.log("Cerrar sesión");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}