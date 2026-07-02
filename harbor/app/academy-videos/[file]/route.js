import { GET as getAcademyVideo } from '../../api/academy-videos/route.js';

export const runtime = 'nodejs';

export async function GET(request) {
  const url = new URL(request.url);
  const file = decodeURIComponent(url.pathname.split('/').pop() || '');

  url.pathname = '/api/academy-videos';
  url.search = '';
  url.searchParams.set('file', file);

  return getAcademyVideo(new Request(url, {
    method: 'GET',
    headers: request.headers,
  }));
}
