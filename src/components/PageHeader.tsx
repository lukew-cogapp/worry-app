import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { lang } from '../config/language';
import { PageContainer } from './PageContainer';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
}

/**
 * Reusable page header with optional back button
 * Used across History, Settings, and Insights pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backTo = '/',
  showBack = true,
  rightSlot,
}) => {
  return (
    <header className="bg-card border-b border-border">
      <PageContainer className="py-md grid grid-cols-[2.5rem_1fr_2.5rem] items-center">
        {showBack ? (
          <Link
            to={backTo}
            className="text-muted-foreground active:text-foreground transition-colors"
            aria-label={lang.aria.back}
          >
            <ChevronLeft className="size-icon-md" aria-hidden="true" />
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}
        <div className="text-center">
          <h1 className="text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>}
        </div>
        {rightSlot ?? <div aria-hidden="true" />}
      </PageContainer>
    </header>
  );
};
