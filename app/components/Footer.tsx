import Image from "next/image";
import Link from "next/link";
import {
  User,
  CalendarDays,
  FileText,
  Wallet,
  ReceiptText,
  GraduationCap,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer(){
    return(
      <section id="contacto" className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Contacto
          </h2>

          <div className="w-12 h-1 bg-emerald-600 mb-8"></div>

          <p className="text-gray-700 mb-2">
            ¿Tienes preguntas o necesitas apoyo? Escríbenos, con gusto te
            ayudaremos.
          </p>
        </div>

        {/* MAPA */}
        <div className="w-full h-[350px]">
          <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11947.65562113375!2d-103.49555941465391!3d20.718004735811316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428a93814030d4d%3A0xa4a73413a5cac566!2sFLEXUS%20ELECTROMEC%C3%81NICA!5e1!3m2!1ses!2smx!4v1777059762285!5m2!1ses!2smx"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="w-full h-full"
></iframe>
        </div>

        {/* DATOS DE CONTACTO */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Ubicación */}
          <div className="flex items-start gap-5">
            <MapPin size={34} className="text-emerald-600 mt-1" />

            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                Ubicación:
              </h4>
              <p className="text-sm text-gray-700 leading-6">
                Carretera a Nogales No. 4935 Nave 101, 45221 Guadalajara,
                Jal.
              </p>
            </div>
          </div>

          {/* Correo */}
          <div className="flex items-start gap-5">
            <Mail size={34} className="text-emerald-600 mt-1" />

            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                Correo:
              </h4>
              <p className="text-sm text-gray-700">
                sales@flexuselec.com
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-start gap-5">
            <Phone size={34} className="text-emerald-600 mt-1" />

            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                Teléfono:
              </h4>
              <p className="text-sm text-gray-700">
                +52 332-267-3601
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER FINAL */}
        <p className="mt-6 text-sm text-gray-500 text-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            Este sitio es informativo. Para cualquier error, duda o aclaración favor de consultar con RH.
        </p>
        <footer className="bg-[#111111] text-white py-8">
          <div className="text-center text-sm">
            © Copyright{" "}
            <span className="font-bold">
              Flexus Electromechanical.
            </span>{" "}
            All Rights Reserved
          </div>
        </footer>
      </section>
    )
}