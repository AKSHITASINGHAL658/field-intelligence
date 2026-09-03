import Link from "next/link";
import { Camera, Leaf, MessageCircle, ScanLine } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <nav className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          <Leaf className="h-4 w-4 text-emerald-600" />
          Field Intelligence
        </span>
        <Link
          href="/scanner"
          className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Open Scanner
        </Link>
      </nav>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Campus plant identification
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          Point, capture, and identify
          <br />
          any plant on campus
        </h1>

        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Take a photo or upload one — an on-device model matches it to a
          species, then you can ask follow-up questions about it.
        </p>

        <Link
          href="/scanner"
          className="mt-8 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <ScanLine className="h-4 w-4" />
          Start scanning
        </Link>

        <div className="mt-20 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <Feature
            icon={<Camera className="h-5 w-5 text-emerald-600" />}
            title="Camera or upload"
            description="Snap a photo on the spot, or upload one you already have."
          />
          <Feature
            icon={<Leaf className="h-5 w-5 text-emerald-600" />}
            title="Instant match"
            description="A model trained on campus flora identifies the species and confidence."
          />
          <Feature
            icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}
            title="AI Botanical Guide"
            description="Chat about the identified plant — habitat, threats, and more."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      {icon}
      <h3 className="mt-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}