import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { json, requireApprovedAcademyAssetSession } from '../academy-asset-auth.js';

const PRIVATE_DOCUMENTS = {
  'DOC_AG_Kunden_Preisliste.pdf': 'DOC_AG_Kunden_Preisliste.pdf',
  'DOC_MA_Your_World.pdf': 'DOC_MA_Your_World.pdf',
  'DOC_MA_Praesentation_Wasser.pdf': 'DOC_MA_Praesentation_Wasser.pdf',
  'DOC_AG_Karriere_und_Verdienstplan.pdf': 'DOC_AG_Karriere_und_Verdienstplan.pdf',
  'DOC_AG_Vertriebspartner_Preisliste_Wasserbar.pdf': 'DOC_AG_Vertriebspartner_Preisliste_Wasserbar.pdf',
  'DOC_AG_Vertriebspartner_Filterpreisliste.pdf': 'DOC_AG_Vertriebspartner_Filterpreisliste.pdf',
  'DOC_AG_Vertriebspartner_Preisliste_Membranen.pdf': 'DOC_AG_Vertriebspartner_Preisliste_Membranen.pdf',
  'DOC_AG_Vertriebspartner_Preisliste_Zusatzartikel.pdf': 'DOC_AG_Vertriebspartner_Preisliste_Zusatzartikel.pdf',
  'DOC_AG_Vertriebspartner_Preisliste_Drops_Vitamine.pdf': 'DOC_AG_Vertriebspartner_Preisliste_Drops_Vitamine.pdf',
  'DOC_MA_Praesentation_RXT.pdf': 'DOC_MA_Praesentation_RXT.pdf',
};

const DOCUMENT_CONTENT_TYPES = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.mp4': 'video/mp4',
};

const INLINE_DOCUMENT_TYPES = new Set(['.pdf', '.mp4']);

function normalizeRequestedFile(value) {
  return decodeURIComponent(String(value || '')).split('/').pop().trim();
}

export async function GET(request) {
  try {
    await requireApprovedAcademyAssetSession(request);

    const { searchParams } = new URL(request.url);
    const requestedFile = normalizeRequestedFile(searchParams.get('file') || request.headers.get('x-harbor-academy-asset-file'));
    const allowedFile = PRIVATE_DOCUMENTS[requestedFile];

    if (!allowedFile) {
      return json({ message: 'Dokument nicht gefunden.' }, 404);
    }

    const filePath = path.join(process.cwd(), 'academy-documents', 'private', allowedFile);
    const file = await readFile(filePath);
    const extension = path.extname(allowedFile).toLowerCase();
    const contentType = DOCUMENT_CONTENT_TYPES[extension] || 'application/octet-stream';
    const disposition = INLINE_DOCUMENT_TYPES.has(extension) ? 'inline' : 'attachment';
    const safeFileName = allowedFile.replace(/["\r\n]/g, '');

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(file.byteLength),
        'Content-Disposition': `${disposition}; filename="${safeFileName}"`,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  } catch (error) {
    return json({ message: error.message || 'Dokument konnte nicht geladen werden.' }, error.statusCode || 500);
  }
}
