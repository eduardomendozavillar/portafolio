import type { ReactNode } from "react";

/** Max-width content wrapper shared by every section of the page. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}