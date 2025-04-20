import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GIS - Grupo de Investigación",
  description: "Sistema de gestión de investigación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning>
        <ProtectedRoute>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
