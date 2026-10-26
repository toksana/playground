import { ImageResponse } from 'next/og';
import { BrandMark } from '@/components/BrandMark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS rounds the corners itself, so the background is a full-bleed square.
const AppleIcon = () =>
  new ImageResponse(<BrandMark size={size.width} rounded={false} />, {
    ...size,
  });

export default AppleIcon;
