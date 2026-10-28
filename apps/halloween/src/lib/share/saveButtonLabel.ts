export type SaveStatus = 'idle' | 'busy' | 'saved' | 'shared' | 'error';

// Text of the "Save image" button: the action while idle, then feedback for what just happened.
export const saveButtonLabel = (
  status: SaveStatus,
  canShare: boolean,
): string => {
  switch (status) {
    case 'busy':
      return canShare ? 'Preparing…' : 'Saving…';
    case 'saved':
      return 'Saved ✓';
    case 'shared':
      return 'Shared ✓';
    case 'error':
      return 'Try again';
    default:
      return canShare ? 'Share image' : 'Save image';
  }
};
