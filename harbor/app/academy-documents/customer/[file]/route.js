import { GET as getAcademyDocument } from '../../../api/academy-documents/route.js';

export const runtime = 'nodejs';

export async function GET(request) {
  const url = new URL(request.url);
  const file = decodeURIComponent(url.pathname.split('/').pop() || '');

  url.pathname = '/api/academy-documents';
  url.search = '';
  url.searchParams.set('file', file);

  return getAcademyDocument(new Request(url, {
    method: 'GET',
    headers: request.headers,
  }));
}
