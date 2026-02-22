interface LogoProps {
  size?: "sm" | "md";
}

export function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "h-7 rounded-md" : "h-9 rounded-lg";

  return (
    <>
      <img src="/logo.png" alt="ΦοροΥπολογιστής" className={`${iconSize} md:hidden`} />
      <img src="/logo_full.png" alt="ΦοροΥπολογιστής" className={`${iconSize} hidden dark:brightness-0 dark:invert md:block`} />
    </>
  );
}
