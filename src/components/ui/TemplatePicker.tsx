'use client';

import {
  availableCategories,
  categoryOfTemplate,
} from '@/lib/carve/templateMenu';
import type { Template } from '@/lib/carve/templates';
import { useCarveStore } from '@/store/useCarveStore';
import { TemplatePopup } from './TemplatePopup';
import { ToolButton } from './ToolButton';
import { useTemplateCarve } from './useTemplateCarve';
import { useTemplateMenu } from './useTemplateMenu';

// Category buttons: a row above the toolbar on touch devices, a column on the right with a mouse.
export const TemplatePicker = () => {
  const visible = useCarveStore((s) => s.phase === 'carving');
  const isAnimating = useCarveStore((s) => s.isAnimating);
  const activeTemplateId = useCarveStore((s) => s.activeTemplateId);
  const menu = useTemplateMenu(visible);
  const carve = useTemplateCarve();

  if (!visible) return null;

  const categories = availableCategories();
  const activeCategory = categoryOfTemplate(activeTemplateId);
  const open = categories.find((c) => c.id === menu.openCategory);

  const select = (template: Template) => {
    menu.close();
    carve(template);
  };

  return (
    <>
      <div className="absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.5rem)] left-1/2 z-20 flex max-w-full -translate-x-1/2 flex-row gap-2 overflow-x-auto px-4 pointer-fine:top-1/2 pointer-fine:right-4 pointer-fine:bottom-auto pointer-fine:left-auto pointer-fine:translate-x-0 pointer-fine:-translate-y-1/2 pointer-fine:flex-col pointer-fine:px-0">
        {categories.map((category) => (
          <ToolButton
            key={category.id}
            disabled={isAnimating}
            aria-haspopup="dialog"
            aria-expanded={menu.openCategory === category.id}
            active={
              menu.openCategory === category.id ||
              activeCategory === category.id
            }
            onClick={(e) => menu.toggle(category.id, e.currentTarget)}
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">{category.glyph}</span>
              {category.label}
            </span>
          </ToolButton>
        ))}
      </div>
      {open !== undefined && (
        <TemplatePopup
          category={open}
          activeTemplateId={activeTemplateId}
          onSelect={select}
          onClose={menu.close}
        />
      )}
    </>
  );
};
