import Image from "next/image"

export function ClientLogos() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
      <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <Image src="/logo-1.png" alt="Client Logo" width={120} height={40} />
      </div>
      <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <Image src="/logo-2.png" alt="Client Logo" width={120} height={40} />
      </div>
      <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <Image src="/logo-3.png" alt="Client Logo" width={120} height={40} />
      </div>
      <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <Image src="/logo-4.png" alt="Client Logo" width={120} height={40} />
      </div>
      <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <Image src="/logo-5.png" alt="Client Logo" width={120} height={40} />
      </div>
    </div>
  )
}
