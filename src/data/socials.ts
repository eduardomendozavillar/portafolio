/** Social profile links rendered in the header and footer. */
export type SocialLink = {
  platform: "github" | "linkedin";
  label: string;
  href: string;
};

/** Real owner profiles — opened in a new tab from the header and footer. */
export const socials: SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    href: "https://github.com/eduardomendozavillar",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardo-mendoza-ing-sistemas",
  },
];
