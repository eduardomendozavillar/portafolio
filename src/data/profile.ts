/** Profile content rendered by the Hero and Sobre mí sections. */
export type Profile = {
  name: string;
  role: string;
  tagline: string;
  /** Paragraphs rendered in the Sobre mí section. */
  about: string[];
};

export const profile: Profile = {
  name: "Eduardo",
  role: "Desarrollador Full-Stack",
  tagline:
    "Construyo productos web claros, accesibles y con fundamento: desde la arquitectura hasta el detalle de la interfaz.",
  about: [
    "Soy un desarrollador de software con foco en aplicaciones web bien diseñadas, accesibles y mantenibles.",
    "Priorizo fundamentos sólidos: arquitectura limpia, tipado estricto, pruebas y atención al detalle en cada entrega.",
  ],
};