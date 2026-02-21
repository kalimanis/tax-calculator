export function Footer() {
  return (
    <footer className="border-t border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)] py-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--lp-navy)] text-xs font-bold text-white">
              Φ
            </div>
            <span className="font-outfit text-sm font-bold text-[var(--lp-navy)]">
              ΦοροΥπολογιστής
            </span>
          </div>

          {/* Disclaimer */}
          <p className="max-w-lg text-xs leading-relaxed text-[var(--lp-text-light)]">
            Ενδεικτικοί υπολογισμοί. Δεν αποτελεί φορολογική συμβουλή.
            Συμβουλευτείτε τον λογιστή σας. Βάσει Ν.4172/2013 &amp;
            Ν.5246/2025.
          </p>

          {/* Copyright & links */}
          <div className="flex items-center gap-4 text-xs text-[var(--lp-text-light)]">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-[var(--lp-navy)]/10">·</span>
            <span>Δημιουργήθηκε στην Ελλάδα</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
