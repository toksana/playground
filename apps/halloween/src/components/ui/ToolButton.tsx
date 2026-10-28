import type { ComponentProps } from 'react';

interface ToolButtonProps extends ComponentProps<'button'> {
  active?: boolean;
}

// 44px minimum touch target (PLAN.md section 7). Shared with link-styled buttons.
export const TOOL_BUTTON_CLASS =
  'grid h-11 min-w-11 place-items-center rounded-full border border-orange-300/30 bg-black/50 px-3 text-sm whitespace-nowrap text-orange-100 backdrop-blur transition-colors select-none enabled:active:bg-orange-500/30 disabled:opacity-35 data-active:border-orange-300 data-active:bg-orange-500/25';

export const ToolButton = ({
  active = false,
  className = '',
  ...props
}: ToolButtonProps) => (
  <button
    type="button"
    data-active={active || undefined}
    className={`${TOOL_BUTTON_CLASS} ${className}`}
    {...props}
  />
);
