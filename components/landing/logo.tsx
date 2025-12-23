import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/" className="flex relative items-center gap-2">
      <div className="relative aspect-square h-10">
        <Image
          src="/logo/icon-mock.jpg" 
          fill
          alt="logo mock'n go"
          className="object-contain rounded-md"
        />
      </div>
        <span className="text-xl font-medium">
          Mock'n
        </span>
        <span className="text-primary font-bold text-xl">Go</span>
      </Link>
  )
}