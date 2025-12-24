import { Bell, Lock, Package, Sparkles } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

const ONBOARDING_KEY = 'worry_box_onboarding_complete';

export const Onboarding: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
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
            Welcome to Worry Box
          </h2>

          <p className="text-muted-foreground italic text-sm">
            "You can't always control what happens, but you can control when you worry about it."
          </p>

          <div className="space-y-3 text-left w-full">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Lock Away Worries</h3>
                <p className="text-sm text-muted-foreground">
                  Add worries with a future unlock date when you can actually act on them
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Get Reminded</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when your worries unlock and you can take action
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Stay Calm</h3>
                <p className="text-sm text-muted-foreground">
                  Stop dwelling on things you can't fix right now and find peace
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleComplete} className="w-full mt-4 min-h-[44px]">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
