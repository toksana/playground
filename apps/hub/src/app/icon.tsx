import { ImageResponse } from 'next/og';
import { BrandMark } from '@/components/BrandMark';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const Icon = () =>
  new ImageResponse(<BrandMark size={size.width} />, { ...size });

export default Icon;
