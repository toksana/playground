import { fortuneImageResponse } from '@/lib/fortune/fortuneImageResponse';
import { allSeeds } from '@/lib/fortune/seed';

export const generateStaticParams = () => allSeeds().map((seed) => ({ seed }));

// Served at /halloween/f/<seed>/og. A plain route instead of the opengraph-image file
// convention, because that one drops the basePath from the URL it puts in the meta tags.
export function GET(
  _request: Request,
  { params }: { params: Promise<{ seed: string }> },
): Promise<Response> {
  return fortuneImageResponse(params);
}
