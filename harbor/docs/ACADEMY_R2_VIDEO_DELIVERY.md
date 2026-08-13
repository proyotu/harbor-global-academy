# Private Academy video delivery with Cloudflare R2

## Current state and architecture

The Academy delivers 14 active MP4 videos through the protected Next.js route `GET /api/academy-videos`. The Prompt 38 release candidate keeps 12 assets under `academy-videos/private/` and maps only reverse osmosis and PPM/TDS to private R2. Production remains unchanged until a separate release approval.

The browser now requests a signed URL with a canonical technical `videoId`. The immutable server allowlist in `app/lib/academy-video-assets.js` maps that ID to a `local` or `r2` source and a server-owned key. The route validates the Academy session, returns a short-lived signed URL containing only the canonical ID, validates it again on every stream request and proxies the selected private source. There is one route and one allowlist, not a parallel R2 architecture.

## Authentication and roles

- Admin sessions are allowed.
- Leaders use the existing partner-session model and are allowed only while their partner record is `approved`.
- Other partners are allowed only while their partner record is `approved`.
- Pending, blocked, rejected and paused partners receive `403`.
- Missing, expired or invalid sessions receive `401`.
- Partner approval is rechecked on signed stream requests, so a later block takes effect before the signed URL expires.

No role, login, registration, database table or Supabase policy was added.

## Canonical allowlist and sources

Each record contains the canonical ID, source (`local` or `r2`), server-owned key and content type. The client cannot choose a bucket, object key or path. Invalid ID syntax returns `400`; an unknown well-formed ID returns `404`. Legacy allowlisted local file names remain accepted server-side for compatibility, but new links use canonical IDs.

Twelve active records remain `source: local`. The release candidate maps only `umkehrosmose-erklaerung` and `ppm-bedeutung` to immutable private R2 keys. The isolated technical ID `academy-r2-e2e-test` remains mapped to its private regression-test key and is not referenced by the Academy catalog, navigation or visible UI.

The local source reads only allowlisted files below `academy-videos/private/`. It is the explicit fallback strategy. There is no automatic fallback from an R2 record to a same-named local file because that could silently serve the wrong version.

The R2 source reuses the SigV4 helper in `lib/storage/r2.ts`. Private `GET` requests may forward one validated `Range` header. R2 endpoint and authorization headers stay server-only; the protected route proxies the body and never exposes a private or presigned R2 URL.

## Environment requirements

The private R2 source requires these server-only variables:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

`R2_PUBLIC_URL` is not used for private Academy playback. Missing credentials produce a sanitized `503` for an R2-backed asset. Values must never be committed, returned or logged.

## HTTP Range support

Supported requests:

- no Range header: `200 OK`;
- `Range: bytes=start-end`: `206 Partial Content`;
- `Range: bytes=start-`: `206 Partial Content`;
- `Range: bytes=-length`: `206 Partial Content`;
- one range only.

Malformed, multiple, reversed or out-of-size ranges return `416`. Responses include `Accept-Ranges: bytes`, `Content-Type`, `Content-Length` and, for partial responses, `Content-Range`. Protected content uses `Cache-Control: private, no-store, max-age=0`. Multi-range responses are intentionally unsupported.

## Error and privacy contract

| Condition | Status | Public response |
|---|---:|---|
| No or invalid session | 401 | Generic login error |
| Partner not approved | 403 | Generic access denial |
| Invalid or manipulated ID | 400 | Invalid video ID |
| Unknown ID or missing allowed object | 404 | Video not found |
| Invalid range | 416 | Empty response with `Content-Range` |
| Missing R2 configuration or storage failure | 503 | Generic storage-unavailable error |
| Unexpected local/server failure | 500 | Generic video-load error |

Responses and logs must not contain tokens, signatures, secrets, bucket names, storage keys, private URLs, upstream bodies or unnecessary personal information. Future operational logs are limited to canonical video ID, response status, source and technical error class.

## Automated validation

`npm test` verifies allowlist resolution; approved Partner and Leader states; denial of pending, blocked, rejected and paused states; signed-link tampering; unauthenticated and invalid sessions; manipulated and unknown IDs; local `200` delivery; first, middle, final and open-ended ranges; byte counts and headers; and `416` for invalid, multi and out-of-size ranges.

## Preview R2 E2E validation

The synthetic, non-production asset `academy_r2_e2e_test_v1.mp4` was uploaded by an isolated Vercel Preview build using server-side Preview credentials. The private object was verified with `video/mp4` and 1,066,262 bytes. No public R2 URL was created or required.

The protected Academy handler returned the following real R2 responses in the isolated Preview:

- full object: `200` and 1,066,262 bytes;
- first 100 bytes: `206` and `Content-Range: bytes 0-99/1066262`;
- middle 100 bytes: `206` and `Content-Range: bytes 500000-500099/1066262`;
- final 100 bytes: `206` and `Content-Range: bytes 1066162-1066261/1066262`;
- open range: `206` and `Content-Range: bytes 1000000-1066261/1066262`;
- 100-byte suffix: `206` and the correct final range;
- out-of-size range: `416`.

All successful responses used `video/mp4`, `Accept-Ranges: bytes` and private/no-store caching. Unauthenticated and invalid-session requests returned `401`; manipulated and unknown IDs returned `400` and `404`. Preview HTML and all delivered JavaScript bundles contained no R2 variable names, private endpoint, bucket URL or storage key.

Real approved-Partner, Leader, Pending and Blocked sessions were not available and were not fabricated. Their authorization rules remain covered by automated tests. Desktop and mobile interaction testing remains a separate manual verification because the technical test ID is intentionally absent from visible Academy UI.

## Reproducible manual test plan

For a later repeat of the isolated technical validation:

1. Upload under a non-production key without overwriting an object.
2. Verify size and `video/mp4` metadata out of band.
3. Add one temporary non-production allowlist record with `source: r2`.
4. Verify Admin, approved Partner and approved Leader playback.
5. Verify `401` without a valid session and `403` for pending, blocked, rejected and paused records.
6. Verify `400`, `404`, `416` and sanitized `503` cases.
7. Test first, middle, final, open-ended and out-of-size ranges.
8. On desktop and mobile, test start without complete download, play, pause, seek and reload.
9. Test a vertical MP4 in the existing `object-contain` player.
10. Remove the temporary mapping or keep it only in an approved test environment.

## Prompt 38 first migration release candidate

- Reverse osmosis (`umkehrosmose-erklaerung`, M03/L02): `academy/videos/de/m03/umkehrosmose-erklaerung/v2/academy_m03_l02_umkehrosmose-erklaerung_de_approved_v2_20260801.mp4`
- PPM/TDS (`ppm-bedeutung`, M10/L02): `academy/videos/de/m10/ppm-bedeutung/v2/academy_m10_l02_ppm-bedeutung_de_approved_v2_20260805.mp4`

Both objects were uploaded privately and verified against their complete local SHA-256 checksums and byte sizes. An isolated Preview using the two R2 mappings returned `200` for each complete object; `206` for start, middle, final, open-ended and suffix ranges; and `416` for invalid ranges. The complete responses matched the approved source hashes. No automatic local fallback was used.

The canonical module, lesson and video IDs remain unchanged, so no duplicate lesson, card or navigation entry is introduced. The previous local files remain retained and unchanged for rollback. Production still serves the local mappings until a separate commit and Production approval.

## Rollout and rollback

After separate production approval, commit and deploy only the two verified canonical mapping changes and their documentation/tests. Retain the previous local files and the private R2 objects.

Rollback changes `umkehrosmose-erklaerung` back to `localVideo(..., 'umkehrosmose-erklaerung.mp4')` and `ppm-bedeutung` back to `localVideo(..., 'ppm-bedeutung.mp4')`, then deploys the last known-good state. R2 objects and local files remain retained; deletion requires separate approval.

## Vercel duplicate project

The repository currently triggers builds in `arbeite-an-meinem-projekt-harbor-global` and `project-kvzsw`. Only the former serves `www.harborglobalacademy.com`. No Vercel project was deleted or reconfigured; cleanup remains a separate task.
