import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "800", "900"],
  variable: "--font-archivo",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Muhammad Usman Khan. — Portfolio",
  description: "Full-stack developer portfolio — Muhammad Usman Khan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
