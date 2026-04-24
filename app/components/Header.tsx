import Image from "next/image";

export default function Header(){
    return(
        <header className="w-full bg-[#24282c]/95 shadow-md">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Flexus Electro"
                width={190}
                height={60}
                className="object-contain"
                priority
              />
            </div>
        
            {/* Espacio derecho vacío para mantener diseño */}
            <div className="hidden md:block w-[190px]"></div>
          </div>
        </header>
    )
}