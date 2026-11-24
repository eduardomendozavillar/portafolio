import { Reveal } from "@/components/Reveal";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Ahora } from "./sections/Ahora";
import { Contacto } from "./sections/Contacto";
import { Educacion } from "./sections/Educacion";
import { Experiencia } from "./sections/Experiencia";
import { Habilidades } from "./sections/Habilidades";
import { Hero } from "./sections/Hero";
import { IntroSplash } from "./sections/IntroSplash";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { Certificaciones } from "./sections/Certificaciones";
import { Proyectos } from "./sections/Proyectos";
import { SobreMi } from "./sections/SobreMi";

/*
 * Single-page composition (task 3.1): every profile section in order.
 * Whole-page scroll reveals (WU-B): one Reveal per section block; the Hero
 * manages its own Reveal inside the section component.
 */
export default function Home() {
  return (
    <LanguageProvider>
      <main className="flex flex-1 flex-col">
        <IntroSplash />
      <Hero />
      <Reveal className="w-full">
        <SobreMi />
      </Reveal>
      <Reveal className="w-full">
        <Experiencia />
      </Reveal>
      <Reveal className="w-full">
        <section id="actividad" className="border-b border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8">
            <p className="mb-4 font-display text-[15px] uppercase tracking-[0.14em] text-accent">// actividad</p>
            <ActivityHeatmap />
          </div>
        </section>
      </Reveal>
      <Reveal className="w-full">
        <Proyectos />
      </Reveal>
      <Reveal className="w-full">
        <Educacion />
      </Reveal>
      <Ahora />
      <Reveal className="w-full">
        <Certificaciones />
      </Reveal>
      <Reveal className="w-full">
        <Habilidades />
      </Reveal>
      <Reveal className="w-full">
        <Contacto />
      </Reveal>
        </main>
    </LanguageProvider>
  );
}