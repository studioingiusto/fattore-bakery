import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://fattoref.com/wp-content/uploads/2023/10/fattore-f-bakery-scaled.jpg"
            alt="Artisanal bread loaves on dark background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        {/* Hero Text */}
        <div className="relative z-20 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <h1
            className="text-white text-center uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              fontFamily: '"Druk Wide", sans-serif',
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: "1.1",
            }}
          >
            <span className="block">ALZA IL LIVELLO DEI</span>
            <span className="block">TUOI PANIFICATI</span>
          </h1>
        </div>
      </div>

      <div className="min-h-screen flex flex-col max-w-7xl mx-auto md:flex-row justify-center items-center md:items-stretch py-8 md:py-0">
        {/* Left side - Bread image */}
        <div className="w-full md:max-w-[510px] flex items-center justify-center p-4 sm:p-6 md:p-8 md:pr-12 lg:pr-24">
          <div className="max-w-sm md:max-w-md lg:max-w-lg">
            <Image
              src="https://fattoref.com/wp-content/uploads/2023/10/fattore-bakery-scaled.jpg"
              alt="Sliced bread showing layered interior"
              width={400}
              height={600}
              className="w-full h-auto"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full bg-[#ffffff] flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto md:mx-0">
            {/* Header */}
            <h2
              className="text-[#4e4e4e] font-bold mb-6 md:mb-8 leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                fontFamily: '"Druk Text Cyr", sans-serif',
                fontStyle: "normal",
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                lineHeight: "1.15",
              }}
            >
              COS&apos;È
              <br />
              FATTORE BAKERY
            </h2>

            {/* Body text */}
            <div
              className="text-[#4e4e4e] leading-relaxed mb-6 md:mb-8 space-y-3 md:space-y-4 text-lg sm:text-xl md:text-2xl lg:text-3xl"
              style={{
                color: "#4E4E4E",
                fontFamily: "Bogart, sans-serif",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "1.4",
              }}
            >
              <p>
                Sei un&apos;attività che ha bisogno di alzare il livello dei suoi
                lievitati?
              </p>
              <p>
                Ti aiutiamo noi mettendo al tuo servizio i nostri lievitati!
              </p>
            </div>

            {/* Call to action button */}
            <button
              className="bg-[#b71918] text-[#ffffff] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors w-full md:w-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontFamily: '"Druk Text Cyr", sans-serif',
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.4",
              }}
            >
              <span className="block sm:inline">
                CONTATTACI PER LA CREAZIONE DEL
              </span>
              <span className="block sm:inline sm:ml-2">
                TUO PANIFICATO SU MISURA
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Test section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#b71918] mb-8">
            Integrazione WordPress Attiva
          </h2>
          <p className="text-lg text-[#4e4e4e]">
            Il sito è pronto per ricevere contenuti da WordPress.
            <br />
            Visita <strong>/blog</strong> per vedere i post del blog.
          </p>
        </div>
      </div>
    </>
  );
} 