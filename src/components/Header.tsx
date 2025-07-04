import Image from 'next/image';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-[9999] bg-transparent">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="https://fattoref.com/wp-content/uploads/2023/11/FB-logo-B.png"
              alt="Fattore F Bakery"
              width={200}
              height={125}
              className="h-[125px] w-auto brightness-0 invert"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
} 