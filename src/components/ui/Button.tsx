import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "bone";

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
  /* CTA de contratación: barber red con esquinas cortadas (rebrand 05). */
  primary:
    "bg-cta text-cta-contrast [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)] hover:bg-cta/90",
  bone:
    "bg-ink text-paper hover:bg-ink/90",
  outline:
    "border-2 border-line text-ink hover:border-accent hover:text-accent",
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