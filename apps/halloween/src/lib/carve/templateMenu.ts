import {
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  templatesByCategory,
} from './templates';
import type {
  Template,
  TemplateCategory,
  TemplateCategoryId,
} from './templates';

// Downward drag (px) on the bottom sheet handle that closes it.
export const SWIPE_CLOSE_DISTANCE = 56;

// Categories without templates are hidden, so an empty popup is never offered.
export const availableCategories = (
  templates: readonly Template[] = TEMPLATES,
): TemplateCategory[] =>
  TEMPLATE_CATEGORIES.filter(
    (c) => templatesByCategory(c.id, templates).length > 0,
  );

export const categoryOfTemplate = (
  templateId: string | null,
  templates: readonly Template[] = TEMPLATES,
): TemplateCategoryId | null =>
  templates.find((t) => t.id === templateId)?.category ?? null;

export const shouldCloseOnSwipe = (startY: number, endY: number): boolean =>
  endY - startY >= SWIPE_CLOSE_DISTANCE;
