import type React from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface DebugErrorDialogProps {
  error: {
    message: string;
    details: string;
    stack?: string;
  } | null;
  onClose: () => void;
}

export const DebugErrorDialog: React.FC<DebugErrorDialogProps> = ({ error, onClose }) => {
  return (
    <Dialog open={!!error} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-destructive">Debug: Error Occurred</DialogTitle>
          <DialogDescription>
            This dialog is for debugging purposes. It will be hidden in production.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Error Message:</h4>
            <p className="text-sm bg-muted p-3 rounded-md font-mono break-words">
              {error?.message}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Details:</h4>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
              {error?.details}
            </pre>
          </div>

          {error?.stack && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Stack Trace:</h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
