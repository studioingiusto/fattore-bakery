'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Considera "scrolled" quando siamo oltre la prima sezione hero (circa 100vh)
      const scrollThreshold = window.innerHeight * 0.8;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="https://fattoref.com/wp-content/uploads/2023/11/FB-logo-B.png"
              alt="Fattore F Bakery"
              width={200}
              height={125}
              className={`h-[125px] w-auto transition-all duration-300 ease-in-out ${
                isScrolled 
                  ? 'filter-none' 
                  : 'brightness-0 invert'
              }`}
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
} 