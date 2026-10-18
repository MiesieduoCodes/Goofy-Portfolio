import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Giant closing call-to-action used at the bottom of inner pages
export function BigCta({
  eyebrow = "Next phase",
  title = "Let's talk",
  href = "/contact",
}: {
  eyebrow?: string;
  title?: string;
  href?: string;
}) {
  return (
    <section className="pb-10">
      <Link href={href} className="group block border-t border-white/10 pt-16">
        <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">{eyebrow}</p>
        <div className="flex items-end justify-between gap-6">
          <span className="text-[13vw] md:text-[9vw] font-black uppercase leading-[0.85] tracking-tighter transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
            {title}
          </span>
          <span className="magnetic mb-[2vw] flex h-16 w-16 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full border border-white/30 transition-colors duration-500 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-6 w-6 md:h-10 md:w-10 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </div>
      </Link>
    </section>
  );
}

// "(01) —— Label" marker above each section
export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
      <span>({index})</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{children}</span>
    </div>
  );
}
