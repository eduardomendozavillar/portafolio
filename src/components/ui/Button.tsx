import type { ReactNode } from "react";

type Variant = "primary" | "outline";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** When present, renders an anchor instead of a button. */
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
  /** Anchor-only extra attributes, e.g. download for file links. */
  download?: string | boolean;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 " +
  "text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<Variant, string> = {
  /* CTA de contratación: rojo barber con glow (rebrand 02). */
  primary:
    "bg-cta text-cta-contrast shadow-[0_0_22px_-4px_rgba(179,43,30,0.5)] hover:bg-cta/90",
  outline:
    "border border-line bg-paper-raised/40 text-ink hover:border-accent hover:text-accent",
};

/** Button/link primitive in the Circuit Night style. */
export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  type = "button",
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}