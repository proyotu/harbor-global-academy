export function parseAcademyVideoRange(rangeHeader, size) {
  if (!rangeHeader) {
    return null;
  }

  const totalSize = Number(size);
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(rangeHeader).trim());

  if (!Number.isSafeInteger(totalSize) || totalSize <= 0 || !match || (!match[1] && !match[2])) {
    throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416, totalSize });
  }

  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : totalSize - 1;

  if (!match[1]) {
    const suffixLength = Number(match[2]);

    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
      throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416, totalSize });
    }

    start = Math.max(totalSize - suffixLength, 0);
    end = totalSize - 1;
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= totalSize) {
    throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416, totalSize });
  }

  return { start, end: Math.min(end, totalSize - 1) };
}

export function assertSingleAcademyVideoRange(rangeHeader) {
  if (!rangeHeader) {
    return '';
  }

  const normalized = String(rangeHeader).trim();
  const match = /^bytes=(\d*)-(\d*)$/.exec(normalized);

  if (!match || (!match[1] && !match[2]) || (match[1] && match[2] && Number(match[2]) < Number(match[1]))) {
    throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416 });
  }

  if ((match[1] && !Number.isSafeInteger(Number(match[1]))) || (match[2] && !Number.isSafeInteger(Number(match[2])))) {
    throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416 });
  }

  return normalized;
}
