export type SaveMode = 'share' | 'download';

const FILENAME = 'pumpkin-fortune.png';

const pngFile = (blob: Blob): File =>
  new File([blob], FILENAME, { type: 'image/png' });

// True where the OS share sheet accepts files (mobile browsers, Safari).
export const canShareFiles = (): boolean =>
  typeof navigator !== 'undefined' &&
  typeof navigator.canShare === 'function' &&
  navigator.canShare({ files: [pngFile(new Blob())] });

export const toPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) reject(new Error('Could not encode the image'));
      else resolve(blob);
    }, 'image/png');
  });

const download = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = FILENAME;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Opens the share sheet where files are supported, otherwise downloads the PNG.
// Closing the share sheet is not an error.
export const saveOrShareCard = async (
  blob: Blob,
  shareText: string,
): Promise<SaveMode> => {
  if (!canShareFiles()) {
    download(blob);
    return 'download';
  }

  try {
    await navigator.share({ files: [pngFile(blob)], text: shareText });
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError'))
      throw error;
  }
  return 'share';
};
