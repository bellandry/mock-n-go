import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Link href="/dashboard">
        <Button>
        Dashboard
      </Button>
    </Link>
    </div>
  );
}
