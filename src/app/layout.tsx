import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Image from "next/image";

const bogartSans = localFont({
  src: [
    {
      path: "./fonts/Bogart-normal-300-100.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Bogart-normal-400-100.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Bogart-normal-700-100.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bogart-sans",
});

const drukWideCyr = localFont({
  src: [
    {
      path: "./fonts/Druk-Wide-Bold-normal-400-100.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Druk-Wide-Cyr-normal-700-100.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-druk-wide-cyr",
});

const drukTextCyr = localFont({
  src: [
    {
      path: "./fonts/Druk-Text-Cyr-normal-400-100.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Druk-Text-Cyr-normal-300-100.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-druk-text-cyr",
});

export const metadata: Metadata = {
  title:
    "Fattore F Bakery - Prodotti Lievitati per Ristorazione | Miglior Pizzeria Vicenza 2023",
  description:
    "Fattore F Bakery: forniamo prodotti lievitati di alta qualità per attività di ristorazione. Pizza, focaccia, pane, panettone su misura. Consulenza gratuita. Premiati come miglior pizzeria di Vicenza 2023.",
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
    <html lang="it">
      <body
        className={`${bogartSans.variable} ${drukWideCyr.variable} ${drukTextCyr.variable} antialiased`}
      >
        <Image
          src="https://fattoref.com/wp-content/uploads/2023/11/FB-logo-B.png"
          alt="Fattore F Bakery"
          width={200}
          height={125}
          className="h-[125px] w-auto fixed top-0 left-0 right-0 z-[9999] mix-blend-difference invert"
          priority
        />
        {children}
      </body>
    </html>
  );
}
