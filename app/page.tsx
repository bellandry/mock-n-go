import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex gap-4 h-screen w-screen items-center justify-center bg-linear-to-br from-orange-700/5 via-transparent to-primary/10">
      <ModeToggle />
      <Link href="/dashboard">
        <Button>
        Dashboard
      </Button>
    </Link>
    </div>
  );
}
