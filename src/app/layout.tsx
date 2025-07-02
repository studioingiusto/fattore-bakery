import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fattore F Bakery - Prodotti Lievitati per Ristorazione | Miglior Pizzeria Vicenza 2023",
  description: "Fattore F Bakery: forniamo prodotti lievitati di alta qualità per attività di ristorazione. Pizza, focaccia, pane, panettone su misura. Consulenza gratuita. Premiati come miglior pizzeria di Vicenza 2023.",
  icons: {
    icon: [
      {
        url: "https://fattoref.com/wp-content/uploads/2019/02/cropped-favicon-ok-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://fattoref.com/wp-content/uploads/2019/02/cropped-favicon-ok-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://fattoref.com/wp-content/uploads/2019/02/cropped-favicon-ok-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "msapplication-TileImage",
        url: "https://fattoref.com/wp-content/uploads/2019/02/cropped-favicon-ok-270x270.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
