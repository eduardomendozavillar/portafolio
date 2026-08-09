import { Contacto } from "./sections/Contacto";
import { Educacion } from "./sections/Educacion";
import { Experiencia } from "./sections/Experiencia";
import { Habilidades } from "./sections/Habilidades";
import { Hero } from "./sections/Hero";
import { Proyectos } from "./sections/Proyectos";
import { SobreMi } from "./sections/SobreMi";

/*
 * Single-page composition (task 3.1): every profile section in order.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <SobreMi />
      <Habilidades />
      <Proyectos />
      <Experiencia />
      <Educacion />
      <Contacto />
    </main>
  );
}