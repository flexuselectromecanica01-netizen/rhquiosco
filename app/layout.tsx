import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rhquiosco",
  description: "rhquiosco",
  icons:{
    icon:"/logosuperior.png",
    shortcut: "/logosuperior.png",
    apple: "/logosuperior.png",
  }
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">

        <main className="flex-1">
          <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
            draggable
          />
          </AuthProvider>
        </main>

      </body>
    </html>
  );
}