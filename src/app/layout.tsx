import "./globals.css";
import { ReactNode } from "react";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Janta Electricals",
  description: "Industrial-grade air coolers & genuine spare parts.",

  viewport: {
    width: "device-width",
    initialScale: 1,
  },

  themeColor: "#000000",

  appleWebApp: {
    capable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} min-h-screen bg-transparent text-white`}>
        <div className="safe-area-container">
          {children}
        </div>
      </body>
    </html>
  );
}