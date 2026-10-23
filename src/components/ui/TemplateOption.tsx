import type { Template } from '@/lib/carve/templates';
import { TemplateThumb } from './TemplateThumb';

interface TemplateOptionProps {
  template: Template;
  active: boolean;
  onSelect: (template: Template) => void;
}

export const TemplateOption = ({
  template,
  active,
  onSelect,
}: TemplateOptionProps) => (
  <button
    type="button"
    aria-label={`Template: ${template.label}`}
    aria-pressed={active}
    data-active={active || undefined}
    onClick={() => onSelect(template)}
    className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl border border-orange-300/20 p-1.5 text-xs text-orange-100 transition-colors select-none active:bg-orange-500/30 data-active:border-orange-300 data-active:bg-orange-500/25"
  >
    <TemplateThumb strokes={template.strokes} />
    <span className="max-w-full truncate">{template.label}</span>
  </button>
);
