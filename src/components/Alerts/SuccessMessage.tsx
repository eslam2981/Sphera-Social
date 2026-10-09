import { CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";
import type { SuccessMessageProps } from '../../types';
export function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;
  
  return createPortal(
    <div className="fixed top-6 right-6 z-[9999] w-fit bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-5 py-3 flex items-center gap-2.5 animate-fade-in-up">
      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
      <p className="text-emerald-500 text-sm font-medium pr-1">{message}</p>
    </div>,
    document.body
  );
}
