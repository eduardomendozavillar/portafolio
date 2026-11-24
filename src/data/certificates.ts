/**
 * Certifications (portfolio-rebrand S6). The four the CV v2 declares are
 * featured; the rest came from the user's link list (2026-10-22). Titles the
 * fetch could not resolve (DataCamp sits behind Cloudflare) use a generic
 * label; PDEVA's name is inferred from the certificate code and should be
 * corrected by the user if it differs.
 */
export type Certificate = {
  title: string;
  issuer: string;
  /** Verification/accomplishment URL, when one exists. */
  url?: string;
  /** Declared in the CV v2 → featured in the top row. */
  featured?: boolean;
  year?: string;
  /** English variant (S11): generic copy only; issuer names and real
   * certificate titles (mostly English already) stay as-is. */
  en?: Partial<Pick<Certificate, "title">>;
};

export const certificates: Certificate[] = [
  // — Featured (CV v2) —
  {
    title: "AI Engineer for Developers Associate (AIED)",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/certificate/AIEDA0012651489251",
    featured: true,
  },
  {
    title: "Google Associate Cloud Engineer",
    issuer: "Google Cloud",
    featured: true,
  },
  {
    title: "AI+ Foundation",
    issuer: "Certificados IT",
    url: "https://certificados.itcolombia.com/certificate/26acbb4e-40a2-46ba-93e9-387d62b03663/ff64160623dc69f16131b296ac4aeeb2/validate",
    featured: true,
  },
  {
    title: "SQL Fundamentals",
    issuer: "Certificación en curso de validación",
    featured: true,
  },

  // — Resueltas por fetch —
  {
    title: "GitHub Foundations",
    issuer: "Certificados IT",
    url: "https://certificados.itcolombia.com/certificate/d233d93d-2f12-4e03-9d47-5b966eed782a/9e7681a362d3a21de3965ba4876a3d9a/validate",
  },
  {
    title: "Drive AI Transformation in Your Organization",
    issuer: "Certificados IT",
    url: "https://certificados.itcolombia.com/certificate/77e0f6a0-4482-4b31-b458-d0ee577a15b3/819f301ad80ca5bca89a0c76e69d9ab8/validate",
  },
  {
    title: "Work smarter with Copilot in Microsoft Fabric",
    issuer: "Certificados IT",
    url: "https://certificados.itcolombia.com/certificate/df6f25fd-b55e-4755-babb-8d984292ad5b/7849c00aa8c43eeff68f8826fb6cbc1a/validate",
  },
  {
    title: "Introduction to AI in Azure",
    issuer: "Certificados IT",
    url: "https://certificados.itcolombia.com/certificate/8e945550-5997-48a7-b103-3fd0329ce3c1/4c7d7bb54861e47a8928dce89c6718cb/validate",
  },
  {
    title: "AI Fundamentals",
    issuer: "Google · Coursera",
    url: "https://www.coursera.org/account/accomplishments/verify/R2X6AQHK561L",
    year: "2026",
  },
  {
    title: "Foundations of Project Management",
    issuer: "Google · Coursera",
    url: "https://www.coursera.org/account/accomplishments/verify/YHPY9HF395YQ",
    year: "2026",
  },
  {
    title: "Aprende SQL",
    issuer: "midudev",
    url: "https://certificados.midudev.com/caed1e92-d7e5-44a7-ac5b-0e5fe229f553.pdf",
    year: "2026",
  },

  // — Bloqueadas por Cloudflare: etiqueta genérica / título inferido —
  {
    title: "Professional Data Engineer Associate",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/certificate/PDEVA0016013722690",
  },
  {
    title: "Track de DataCamp — Statement of Accomplishment",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/d3c834686438f52dbff5f6d3e9288e8ebc490bf1",
  },
  {
    title: "Track de DataCamp — Statement of Accomplishment",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/bd80fe125764625ff87cda060b9a3a833bfaf909",
  },
  {
    title: "Track de DataCamp — Statement of Accomplishment",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/673aed1f8ea22bc110c7065b3fe0382ee49e9448",
  },
  {
    title: "Track de DataCamp — Statement of Accomplishment",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/88ca6ee724f7a791ae534e1c1ecef51da6a7cc17",
  },
  {
    title: "Track de DataCamp — Statement of Accomplishment",
    issuer: "DataCamp",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/d3419b24b67cce3f47b03da062dba923432f5cec",
  },
  {
    title: "Certificación verificada (blockchain)",
    issuer: "certs365",
    url: "https://verify.certs365.io/?=64038b5dbbe7",
    en: { title: "Verified certification (blockchain)" },
  },
];
