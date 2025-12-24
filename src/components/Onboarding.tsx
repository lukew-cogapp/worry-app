import { Preferences } from '@capacitor/preferences';
import { Bell, Lock, Package, Sparkles } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { lang } from '../config/language';
import { STORAGE_KEYS } from '../types';
import { Button } from './ui/button';

export const Onboarding: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.ONBOARDING });
      if (!value) {
        setIsOpen(true);
      }
    }
    checkOnboarding();
  }, []);

  const handleComplete = async () => {
    await Preferences.set({ key: STORAGE_KEYS.ONBOARDING, value: 'true' });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-300 border border-border">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="mb-2">
            <Package className="w-16 h-16 text-primary" />
          </div>

          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            {lang.onboarding.title}
          </h2>

          <p className="text-muted-foreground italic text-sm">{lang.onboarding.quote}</p>

          <div className="space-y-3 text-left w-full">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {lang.onboarding.features.lock.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang.onboarding.features.lock.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {lang.onboarding.features.remind.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang.onboarding.features.remind.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {lang.onboarding.features.calm.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang.onboarding.features.calm.description}
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleComplete} className="w-full mt-4 min-h-[44px]">
            {lang.onboarding.cta}
          </Button>
        </div>
      </div>
    </div>
  );
};
