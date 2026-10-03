import { Reveal } from "@/components/Reveal";
import { Contacto } from "./sections/Contacto";
import { Educacion } from "./sections/Educacion";
import { Experiencia } from "./sections/Experiencia";
import { Habilidades } from "./sections/Habilidades";
import { Hero } from "./sections/Hero";
import { Proyectos } from "./sections/Proyectos";
import { SobreMi } from "./sections/SobreMi";

/*
 * Single-page composition (task 3.1): every profile section in order.
 * Whole-page scroll reveals (WU-B): one Reveal per section block; the Hero
 * manages its own Reveal inside the section component.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Reveal className="w-full">
        <Proyectos />
      </Reveal>
      <Reveal className="w-full">
        <SobreMi />
      </Reveal>
      <Reveal className="w-full">
        <Habilidades />
      </Reveal>
      <Reveal className="w-full">
        <Experiencia />
      </Reveal>
      <Reveal className="w-full">
        <Educacion />
      </Reveal>
      <Reveal className="w-full">
        <Contacto />
      </Reveal>
    </main>
  );
}