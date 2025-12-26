import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { lang } from '../config/language';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
}

/**
 * Reusable page header with optional back button
 * Used across History, Settings, and Insights pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backTo = '/' }) => {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link
          to={backTo}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={lang.aria.back}
        >
          <ChevronLeft className="size-icon-md" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};
