'use client';

import { useEffect, useRef } from 'react';
import { shouldCloseOnSwipe } from '@/lib/carve/templateMenu';
import { templatesByCategory } from '@/lib/carve/templates';
import type { Template, TemplateCategory } from '@/lib/carve/templates';
import { TemplateOption } from './TemplateOption';

interface TemplatePopupProps {
  category: TemplateCategory;
  activeTemplateId: string | null;
  onSelect: (template: Template) => void;
  onClose: () => void;
}

// Bottom sheet on touch devices, popover left of the category bar with a mouse.
// The backdrop covers the canvas, so a tap outside closes the popup and never draws.
export const TemplatePopup = ({
  category,
  activeTemplateId,
  onSelect,
  onClose,
}: TemplatePopupProps) => {
  const sheet = useRef<HTMLDivElement>(null);
  const swipeStartY = useRef<number | null>(null);

  useEffect(() => {
    sheet.current?.focus();
  }, []);

  const endSwipe = (clientY: number) => {
    const startY = swipeStartY.current;
    swipeStartY.current = null;
    if (startY !== null && shouldCloseOnSwipe(startY, clientY)) onClose();
  };

  return (
    <>
      <div
        role="presentation"
        onPointerDown={onClose}
        className="fixed inset-0 z-10 bg-black/40 pointer-fine:bg-transparent"
      />
      <div
        ref={sheet}
        role="dialog"
        aria-label={`${category.label} templates`}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-orange-300/30 bg-black/80 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur outline-none pointer-fine:absolute pointer-fine:inset-x-auto pointer-fine:top-1/2 pointer-fine:right-32 pointer-fine:bottom-auto pointer-fine:w-64 pointer-fine:-translate-y-1/2 pointer-fine:rounded-2xl pointer-fine:border pointer-fine:p-3"
      >
        <div
          aria-hidden="true"
          onPointerDown={(e) => {
            swipeStartY.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => endSwipe(e.clientY)}
          onPointerCancel={() => (swipeStartY.current = null)}
          className="mx-auto mb-2 grid h-6 w-full touch-none place-items-center pointer-fine:hidden"
        >
          <div className="h-1 w-10 rounded-full bg-orange-100/40" />
        </div>
        <div className="grid max-h-[50vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 pointer-fine:max-h-80 pointer-fine:grid-cols-3">
          {templatesByCategory(category.id).map((template) => (
            <TemplateOption
              key={template.id}
              template={template}
              active={activeTemplateId === template.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
};
