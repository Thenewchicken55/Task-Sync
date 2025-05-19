import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskSync",
  description: "A todo app with calendar integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-100 min-h-screen`}>
        <ToastProvider>
          <Toast />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
