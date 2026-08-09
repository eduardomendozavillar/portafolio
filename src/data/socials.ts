/** Social profile links rendered in the header and footer. */
export type SocialLink = {
  platform: "github" | "linkedin";
  label: string;
  href: string;
};

/** Editable placeholder URLs — replace with the real profiles before deploy. */
export const socials: SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    href: "https://github.com/tu-usuario",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tu-usuario",
  },
];