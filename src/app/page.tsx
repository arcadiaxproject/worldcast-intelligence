import Hero from "@/components/Hero";
import ProjectWorldcast from "@/components/ProjectWorldcast";
import Workflow from "@/components/Workflow";
import WhyJoin from "@/components/WhyJoin";
import Navbar from "@/components/Navbar";
import WhatsAppChat from "@/components/WhatsAppChat";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 font-sans">
      <Navbar />

      <Hero />
      <ProjectWorldcast />
      <WhatsAppChat />
      <Workflow />
      <WhyJoin />

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-zinc-600">
        Javier Navas · Worldcast Intelligence · IA 100% local
      </footer>
    </div>
  );
}
