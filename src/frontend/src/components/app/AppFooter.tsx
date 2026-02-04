import React from 'react';

export default function AppFooter() {
  return (
    <footer className="relative z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 footer-bottom-safe">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:gap-3">
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>© CloseCircle. 2026. Built by</span>
            <a
              href="https://x.com/AbelOdoh_IC"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Abel Odoh
            </a>
            <span>using Caffeine AI</span>
          </p>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <p className="flex items-center gap-1.5">
            <span>Powered by Internet Computer</span>
            <img
              src="/assets/generated/icp-logo.dim_64x64.png"
              alt=""
              aria-hidden="true"
              className="h-4 w-4 opacity-80"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
