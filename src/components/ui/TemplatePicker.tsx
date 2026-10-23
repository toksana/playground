'use client';

import { TEMPLATES } from '@/lib/carve/templates';
import { useCarveStore } from '@/store/useCarveStore';
import { ToolButton } from './ToolButton';

// Row above the toolbar on touch devices, column on the right with a mouse.
export const TemplatePicker = () => {
  const visible = useCarveStore((s) => s.phase === 'carving');
  const loadTemplate = useCarveStore((s) => s.loadTemplate);
  const activeTemplateId = useCarveStore((s) => s.activeTemplateId);

  if (!visible) return null;

  return (
    <div className="absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.5rem)] left-1/2 flex max-w-full -translate-x-1/2 flex-row gap-2 overflow-x-auto px-4 pointer-fine:top-1/2 pointer-fine:right-4 pointer-fine:bottom-auto pointer-fine:left-auto pointer-fine:translate-x-0 pointer-fine:-translate-y-1/2 pointer-fine:flex-col pointer-fine:px-0">
      {TEMPLATES.map((template) => (
        <ToolButton
          key={template.id}
          aria-label={`Template: ${template.label}`}
          active={activeTemplateId === template.id}
          aria-pressed={activeTemplateId === template.id}
          onClick={() => loadTemplate(template.id, template.strokes)}
        >
          {template.label}
        </ToolButton>
      ))}
    </div>
  );
};
