'use client';

import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { useEffect, useRef, useState } from "react";

// Hook personalizzato per gestire l'animazione reveal
function useRevealAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Hook personalizzato per gestire l'effetto parallasse
function useParallax() {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const elementTop = ref.current.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Calcola l'offset solo quando l'elemento è visibile
        if (rect.top < windowHeight && rect.bottom > 0) {
          const rate = (scrolled - elementTop) * 0.5;
          setOffsetY(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Esegui subito per inizializzare
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, offsetY };
}

// Componente per singola immagine con animazione
function RevealImage({ src, alt, delay = 0 }: { src: string; alt: string; delay?: number }) {
  const { ref, isVisible } = useRevealAnimation();

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-[1200ms] ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={320}
        height={240}
        className="object-cover w-full h-[240px] rounded-lg hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

// Componente per immagine con effetto parallasse
function ParallaxImage({ src, alt, width, height }: { 
  src: string; 
  alt: string; 
  width: number; 
  height: number; 
}) {
  const { ref, offsetY } = useParallax();

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg"
      style={{
        width: '100%',
        maxWidth: '800px',
        height: '420px',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        style={{
          transform: `translateY(${offsetY * 0.3}px)`,
          transition: 'transform 0.1s ease-out',
          minHeight: '120%',
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
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
          <h1 className=" text-white text-center uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="block">ALZA IL LIVELLO DEI</span>
            <span className="block">TUOI PANIFICATI</span>
          </h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="min-h-screen flex flex-col max-w-5xl mx-auto md:flex-row justify-center items-center md:items-stretch py-8 md:py-0">
        {/* Left side - Bread image */}
        <div className="w-full md:max-w-[510px] flex items-center justify-center p-4 sm:p-6 md:p-8 md:pr-12 lg:pr-24">
          <div className="max-w-sm md:max-w-md lg:max-w-lg">
            <Image
              src="https://fattoref.com/wp-content/uploads/2023/10/fattore-bakery-scaled.jpg"
              alt="Sliced bread showing layered interior"
              width={400}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full bg-[#ffffff] flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto md:mx-0">
            {/* Header */}
            <h2 className="text-[#4e4e4e] font-medium mb-6 md:mb-8 leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              COS&apos;È
              <br />
              FATTORE BAKERY
            </h2>

            {/* Body text */}
            <div className="text-[#4e4e4e] leading-relaxed mb-6 md:mb-8 space-y-3 md:space-y-4 text-lg sm:text-xl md:text-2xl lg:text-3xl">
              <p>
                Sei un&apos;attività che ha bisogno di alzare il livello dei
                suoi lievitati?
              </p>
              <p>
                Ti aiutiamo noi mettendo al tuo servizio i nostri lievitati!
              </p>
            </div>

            {/* Call to action button */}
            <a
              href="#contact-form"
              className="bg-[#b71918] text-[#ffffff] text-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors w-full md:w-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl inline-block"
            >
              <span className="block sm:inline">
                CONTATTACI PER LA CREAZIONE DEL
              </span>
              <span className="block sm:inline sm:ml-2">
                TUO PANIFICATO SU MISURA
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-[#b71918]">FATTORE F</span>{" "}
            <span className="text-[#4e4e4e]">È STATA VOTATA COME</span>{" "}
            <span className="text-[#b71918]">
              MIGLIOR PIZZERIA DI VICENZA DEL 2023
            </span>
          </h3>

          <p className="text-center font-bold mt-8 md:mt-12 lg:mt-16 text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto">
            <span className="text-[#4e4e4e]">
              Se cerchi qualcosa di più sartoriale,{" "}
            </span>
            <span className="text-[#b71918]">
              cucito su misura per il tuo locale
            </span>
            <span className="text-[#4e4e4e]">
              , sei nella pagina giusta, ti forniremo una{" "}
            </span>
            <span className="text-[#b71918]">consulenza gratuita</span>
            <span className="text-[#4e4e4e]">
              {" "}
              dove studieremo assieme il prodotto che meglio risponde alle tue
              esigenze.
            </span>
          </p>

          <div className="text-center mt-8 md:mt-12 lg:mt-16 max-w-4xl mx-auto">
            <p className="text-3xl font-bold mb-6 md:mb-8">
              <span className="text-[#4e4e4e]">FATTORE BAKERY </span>
              <span className="text-[#b71918]">
                ti presenta una selezione dei suoi prodotti:
              </span>
            </p>

            <div
              className="text-3xl font-bold mb-6 md:mb-8 space-y-2"
              // style={{
              //   fontFamily: "Bogart, sans-serif",
              //   lineHeight: "1.4",
              //   color: "#4e4e4e",
              // }}
            >
              <p>Pizza tonda al piatto classica</p>
              <p>Pizza in teglia alla romana</p>
              <p>Pizza alla pala</p>
              <p>Focaccia soffice</p>
              <p>Pane</p>
              <p>Panettone</p>
              <p>Colomba</p>
            </div>

            <p className="text-3xl font-bold mb-8 md:mb-12">
              Ci hanno già scelto per la loro ristorazione:
            </p>

            {/* Logos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 md:gap-12 lg:gap-16 justify-items-center">
              <Image
                src="https://fattoref.com/wp-content/uploads/2023/10/bacaro-logo.jpg"
                alt="Bacaro logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2023/10/cornoer-logo.jpg"
                alt="Cornoer logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2023/10/Enoe-logo.png"
                alt="Enoe logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2023/10/Ofelia-logo.png"
                alt="Ofelia logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2023/10/romano-logo.png"
                alt="Romano logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/tdl-logo.png"
                alt="TDL logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/jb-logo.jpg"
                alt="JB logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/buganiere-logo.png"
                alt="Buganiere logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/meneghina-logo.png"
                alt="Meneghina logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/babu-logo.png"
                alt="Babu logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/madlen-logo.png"
                alt="Madlen logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
              <Image
                src="https://fattoref.com/wp-content/uploads/2024/04/caffev-logo.jpg"
                alt="Caffev logo"
                width={145}
                height={145}
                className="object-contain w-[145px] h-[145px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lab Photos Gallery */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-1-scaled.webp"
              alt="Fattore F Lab 1"
              delay={0}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-2-e1695893472916.webp"
              alt="Fattore F Lab 2"
              delay={200}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-3-scaled-e1695893327694.webp"
              alt="Fattore F Lab 3"
              delay={400}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-4-scaled.webp"
              alt="Fattore F Lab 4"
              delay={600}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-5-scaled-e1695893356886.webp"
              alt="Fattore F Lab 5"
              delay={800}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-6-scaled-e1695893385722.webp"
              alt="Fattore F Lab 6"
              delay={1000}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-7.webp"
              alt="Fattore F Lab 7"
              delay={1200}
            />
            <RevealImage
              src="https://fattoref.com/wp-content/uploads/2023/09/fattore_f_lab-8-scaled.webp"
              alt="Fattore F Lab 8"
              delay={1400}
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <a
            href="#contact-form"
            className="bg-[#b71918] text-[#ffffff] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors w-full md:w-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl inline-block text-center"
          >
            CONTATTACI PER LA CREAZIONE DEL TUO PANIFICATO SU MISURA
          </a>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#b71918] mb-12 md:mb-16 lg:mb-20">
            PERCHÈ SCEGLIERCI
          </h2>

          {/* Numbered Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Point 1 */}
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-9xl flex-shrink-0"
                style={{
                  fontFamily: "var(--font-druk-wide-cyr)",
                  fontWeight: 700,
                  lineHeight: "1",
                  WebkitTextStroke: "2px #b71918",
                }}
              >
                1.
              </div>
              <p className="text-[#4e4e4e] text-lg sm:text-xl md:text-2xl lg:text-3xl pt-2 md:pt-4">
                Siamo in continuo aggiornamento seguendo corsi di alto livello.
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-9xl flex-shrink-0"
                style={{
                  fontFamily: "var(--font-druk-wide-cyr)",
                  fontWeight: 700,
                  lineHeight: "1",
                  WebkitTextStroke: "2px #b71918",
                }}
              >
                2.
              </div>
              <p className="text-[#4e4e4e] text-lg sm:text-xl md:text-2xl lg:text-3xl pt-2 md:pt-4">
                Offrire visione moderna perché giovani.
              </p>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-9xl flex-shrink-0"
                style={{
                  fontFamily: "var(--font-druk-wide-cyr)",
                  fontWeight: 700,
                  lineHeight: "1",
                  WebkitTextStroke: "2px #b71918",
                }}
              >
                3.
              </div>
              <p className="text-[#4e4e4e] text-lg sm:text-xl md:text-2xl lg:text-3xl pt-2 md:pt-4">
                I nostri panificati vengono scelti da numerose realtà
                lavorative.
              </p>
            </div>

            {/* Point 4 */}
            <div className="flex items-start gap-4 md:gap-6">
              <div
                className="text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-9xl flex-shrink-0"
                style={{
                  fontFamily: "var(--font-druk-wide-cyr)",
                  fontWeight: 700,
                  lineHeight: "1",
                  WebkitTextStroke: "2px #b71918",
                }}
              >
                4.
              </div>
              <p className="text-[#4e4e4e] text-lg sm:text-xl md:text-2xl lg:text-3xl pt-2 md:pt-4">
                Siamo conosciuti e supportati da realtà importanti.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center mt-12 md:mt-16 lg:mt-20">
          <div
            className="w-48 h-[5px]"
            style={{
              backgroundColor: "#50485b",
            }}
          />
        </div>
      </div>

      {/* Awards and Partnerships Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1: AMBASCIATORI DI */}
            <div className="text-center">
              <h3 className="text-[#b71918] uppercase mb-6 md:mb-8">
                AMBASCIATORI DI
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src="http://fattoref.com/wp-content/uploads/2023/10/logo-moretti-forni-300x71.png"
                    alt="Moretti Forni logo"
                    width={200}
                    height={47}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="http://fattoref.com/wp-content/uploads/2023/04/logo-aenp.jpg"
                    alt="AENP logo"
                    width={150}
                    height={100}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: MIGLIOR PIZZERIA DI VICENZA */}
            <div className="text-center">
              <h3 className="text-[#b71918] uppercase mb-6 md:mb-8">
                MIGLIOR PIZZERIA DI VICENZA
              </h3>
              <div className="flex justify-center">
                <Image
                  src="https://fattoref.com/wp-content/uploads/2024/04/gdv2024-192x300.png"
                  alt="Guida del Vino 2024"
                  width={128}
                  height={200}
                  className="object-contain max-w-full h-auto"
                />
              </div>
            </div>

            {/* Column 3: SELEZIONATI DA */}
            <div className="text-center">
              <h3 className="text-[#b71918] uppercase mb-6 md:mb-8">
                SELEZIONATI DA
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src="http://fattoref.com/wp-content/uploads/2023/04/logo-artigiano-mastro.jpg"
                    alt="Artigiano Mastro logo"
                    width={150}
                    height={100}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="https://fattoref.com/wp-content/uploads/2023/09/bongiovanni-logo-300x113.webp"
                    alt="Bongiovanni logo"
                    width={200}
                    height={75}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Column 4: PREMIATI DA */}
            <div className="text-center">
              <h3 className="text-[#b71918] uppercase mb-6 md:mb-8">
                PREMIATI DA
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src="https://fattoref.com/wp-content/uploads/2023/10/gambero-rosso-300x87.webp"
                    alt="Gambero Rosso logo"
                    width={200}
                    height={58}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="https://fattoref.com/wp-content/uploads/2024/03/pizzaecocktail-300x65.png"
                    alt="Pizza e Cocktail logo"
                    width={200}
                    height={43}
                    className="object-contain max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <a
            href="#contact-form"
            className="bg-[#b71918] text-[#ffffff] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors w-full md:w-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl inline-block"
          >
            <span className="block sm:inline">
              CONTATTACI PER LA CREAZIONE DEL
            </span>
            <span className="block sm:inline sm:ml-2">
              TUO PANIFICATO SU MISURA
            </span>
          </a>
        </div>
      </div>

      {/* Chi Siamo Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#b71918] mb-8 md:mb-12 lg:mb-16">
            CHI SIAMO
          </h2>

          <div className="flex justify-center">
            <ParallaxImage
              src="http://fattoref.com/wp-content/uploads/2025/07/riccardo-fattore-bakery.jpg"
              alt="Riccardo - Fattore Bakery"
              width={800}
              height={420}
            />
          </div>

          <p className="text-center mt-8 md:mt-12 lg:mt-16 text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto">
            Riccardo ha intrapreso il suo percorso nel mondo dell&apos;arte bianca, o panificazione, con una profonda passione per la cucina e la panificazione.
          </p>

          {/* Single Column Section - Riccardo */}
          <div className="flex justify-center mt-12 md:mt-16 lg:mt-20">
            <div className="max-w-4xl text-center">
              <h3 className="text-[#b71918] uppercase mb-6 md:mb-8 text-xl sm:text-2xl md:text-3xl">
                RICCARDO
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl">
                ha iniziato la sua carriera giovanissimo, lavorando in una
                pizzeria vicino a casa. Ha sperimentato diverse tipologie di
                impasto e farina, fino a diventare un esperto nel settore. Ha
                lavorato come responsabile in vari locali e ha avviato attività
                per altri ristoratori. Si è specializzato nella panificazione
                tramite corsi presso l&apos;Università della Pizza e
                frequentando un corso di specializzazione sul lievito madre e la
                pizza gourmet con Simone Padoan, che gli ha permesso di
                confrontarsi con grandi maestri dell&apos;arte bianca come
                Renato Bosco.
              </p>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 md:mt-12 lg:mt-16 text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto">
          Ha intrapreso un percorso appassionato e dedicato nel mondo della panificazione, imparando da esperti e specializzandosi in varie aree dell&apos;arte bianca.
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center uppercase text-transparent text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            style={{
              fontFamily: "var(--font-druk-wide-cyr)",
              fontWeight: 700,
              lineHeight: "1",
              WebkitTextStroke: "2px #b71918",
            }}
          >
            RICEVI MAGGIORI INFORMAZIONI
          </h2>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact-form">
        <ContactForm />
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Company Info */}
            <div className="text-left">
              <h3 className="text-[#4e4e4e] uppercase mb-4">
                BACARO DELLA PIZZA SRL
              </h3>
              <p className="text-[#4e4e4e] mb-6">
                Via A. Giuriolo, 2 36100 Vicenza
              </p>
            </div>

            {/* Middle Column - Social Icons and Policies */}
            <div className="text-center">
              {/* Social Media Icons */}
              <div className="flex justify-center gap-3 mb-6">
                <a
                  href="https://www.facebook.com/FattoreF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity"
                  aria-label="Facebook"
                >
                  <Image
                    src="https://fattoref.com/wp-content/uploads/2019/01/fattoref-bacaro-della-pizza-logo-fb.png"
                    alt="Facebook"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </a>
                <a
                  href="https://www.instagram.com/fattore_f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity"
                  aria-label="Instagram"
                >
                  <Image
                    src="http://fattoref.com/wp-content/uploads/2019/01/fattoref-bacaro-della-pizza-logo-instagram.png"
                    alt="Instagram"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </a>
              </div>

              <div className="space-y-4">
                <a
                  href="#"
                  className="block text-[#4e4e4e] hover:text-[#b71918] transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-[#4e4e4e] hover:text-[#b71918] transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="text-right">
              <h3 className="text-[#4e4e4e] uppercase mb-4">CONTATTACI</h3>
              <div className="space-y-2 mb-4">
                <p className="text-[#4e4e4e]">
                  Riccardo <span className="font-bold">340 56 09 752</span>
                </p>
              </div>
              <p className="text-[#4e4e4e] mb-8">
                mail. <span className="font-bold">info@fattoref.com</span>
              </p>
            </div>
          </div>

          {/* Bottom Credits */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              Created by <span className="font-bold">Yard Studio</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
