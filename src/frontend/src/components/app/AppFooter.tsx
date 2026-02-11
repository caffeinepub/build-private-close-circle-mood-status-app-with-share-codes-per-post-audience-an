import { Heart } from 'lucide-react';

export default function AppFooter() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';
  
  const caffeineUrl = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`;

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container max-w-2xl mx-auto px-4 py-2 pb-safe">
        <div className="flex flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()}. CloseCircle.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-primary fill-primary" aria-label="love" /> by{' '}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Caffeine.ai
            </a>
            {' '}and Abel Odoh
          </p>
        </div>
      </div>
    </footer>
  );
}
