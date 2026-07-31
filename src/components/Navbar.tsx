const LINKS = [
  { href: "#historia", label: "Mi historia" },
  { href: "#worldcast-intelligence", label: "Proyecto" },
  { href: "#workflow", label: "Workflow" },
  { href: "#chat", label: "Chat" },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="text-sm font-semibold tracking-tight text-zinc-50">
          Javier Navas
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="/cv.pdf"
          download
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
        >
          Descargar CV
        </a>
      </div>
    </nav>
  );
}
