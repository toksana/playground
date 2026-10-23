import { useEffect, useRef, useState } from 'react';
import type { TemplateCategoryId } from '@/lib/carve/templates';

interface TemplateMenu {
  openCategory: TemplateCategoryId | null;
  toggle: (category: TemplateCategoryId, trigger: HTMLElement) => void;
  close: () => void;
}

// Which category popup is open. Esc closes it and focus goes back to the button that opened it.
// `enabled` false (not carving) resets the menu so it never reappears stale.
export const useTemplateMenu = (enabled: boolean): TemplateMenu => {
  const [openCategory, setOpenCategory] = useState<TemplateCategoryId | null>(
    null,
  );
  const trigger = useRef<HTMLElement | null>(null);

  if (!enabled && openCategory !== null) setOpenCategory(null);

  const close = () => {
    setOpenCategory(null);
    trigger.current?.focus();
  };

  const toggle = (category: TemplateCategoryId, button: HTMLElement) => {
    trigger.current = button;
    setOpenCategory((current) => (current === category ? null : category));
  };

  useEffect(() => {
    if (openCategory === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenCategory(null);
      trigger.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openCategory]);

  return { openCategory, toggle, close };
};
