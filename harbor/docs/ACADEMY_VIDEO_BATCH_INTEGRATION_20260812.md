# Academy Video Batch Integration – 2026-08-12

## Scope and release state

This document records the verified batch without publishing it. The active Academy catalog, video allowlist and local protected-video route remain unchanged.

- Source workspace: read-only; 8 top-level MP4 candidates found.
- Main worktree: all 8 files copied with matching byte sizes and SHA-256 checksums.
- Legal files copied: 0.
- R2 upload: blocked because no R2 credentials are available in the integration environment.
- Protected Academy R2 playback: not implemented in the current production branch. The active route reads allowlisted files from `academy-videos/private/`.
- Live catalog switch: blocked until private R2 upload, protected range playback, mobile/desktop playback and access-control tests pass.
- Binary policy: top-level `academy-videos/*.mp4` source files remain outside Git.

## Verified local inventory

All files use H.264 video and AAC stereo audio and completed a full decode without errors.

| Candidate | Bytes | Duration | Resolution | SHA-256 |
|---|---:|---:|---:|---|
| `DE-mini-touch-aufbau-wassertank-bedienung-approved-v1-20260805.mp4` | 23,509,385 | 04:52.960 | 352×624 | `B7B39D18075B6AF56E95B3F4DF506AACB8CA9489088E672D25D4C702A7DC9DA5` |
| `DE-mini-touch-filterwechsel-filterstatus-wartung-approved-v1-20260805.mp4` | 22,948,327 | 03:11.440 | 576×1024 | `05EFF69C2003992DD7BEFD8932E7C3A86CFFF0F2A93A850AFBB656088C0527AB` |
| `DE-mini-touch-touchdisplay-wasserausgabe-approved-v1-20260805.mp4` | 22,948,059 | 04:37.960 | 352×624 | `38CEF4265C776D14430C2F12A459E4E3F18DC7554F5B82FD3BE8587F90074ABB` |
| `DE-ppm-testgeraet-bedeutung-aussagegrenzen-approved-v2-20260805.mp4` | 25,344,485 | 03:29.160 | 576×1024 | `E174B19D1E3FA83E71D759BBD2B2187EDC448A8D4CC48F0E3B22F5A8009F6D00` |
| `DE-sparkling-pro-bedienung-wasserausgabe-systemaufbau-approved-v1-20260812.mp4` | 29,384,360 | 04:08.040 | 576×1024 | `0DF3CA67994A748A47D69BE6FC62792E187E919416A11C3B7B4425EFC8E03A54` |
| `DE-umkehrosmose-membran-filterfeinheit-approved-v1-20260801.mp4` | 48,842,475 | 06:43.280 | 576×1024 | `3E50A836CC293D876A24926E2B717D092A7F6E2EFFF08D9B966DD21C412794D1` |
| `DE-untertischanlage-bedienung-flush-reset-wartung-approved-v1-20260805.mp4` | 35,967,479 | 05:06.200 | 576×1024 | `A5EAB1443E241D460B5EAF20D49B07E66BD43D17B1C35C615A856BE5320A56C9` |
| `Mxx-Lxx-DE-ppm-wert-bedeutung-approved-v1-20260801.mp4` | 25,344,485 | 03:29.160 | 576×1024 | `A32B3F28D097567B6467FC18696C188751ACAE573D26698FFF17255E85BB43B1` |

## Canonical mapping decisions

### 1. Reverse osmosis and membrane filtration

- Existing module: `3 – Produkte`
- Existing lesson position: `M03 / L02`
- Canonical lesson ID: `video-osmosis`
- Canonical video ID: `umkehrosmose-erklaerung`
- Decision: replace the existing video after the secure release gates pass; do not create another lesson.
- Final asset name: `academy_m03_l02_umkehrosmose-erklaerung_de_approved_v2_20260801.mp4`
- R2 key: `academy/videos/de/m03/umkehrosmose-erklaerung/v2/academy_m03_l02_umkehrosmose-erklaerung_de_approved_v2_20260801.mp4`
- Future DE title: `Wie fein filtert eine Umkehrosmosemembran?`
- Future EN title: `How finely does a reverse osmosis membrane filter?`
- Live state: unchanged; the previous asset remains active and must not be deleted.

### 2. Undercounter system operation and maintenance

- Product area: module `3 – Produkte`.
- Existing canonical lesson: none found.
- Canonical lesson ID/video ID: not assigned.
- Decision: hold as an approved candidate. A content-owner decision is required before creating a new lesson.
- Final Academy filename and R2 key: intentionally unresolved until a lesson position and canonical IDs are approved.
- Live state: not published.

### 3. Mini Touch structure and water tank

- Product area: module `3 – Produkte`.
- Existing canonical lesson: none found.
- Canonical lesson ID/video ID: not assigned.
- Decision: hold as a candidate. It may become one part of a consolidated Mini Touch lesson, but no lesson is created automatically.
- Final Academy filename and R2 key: intentionally unresolved.
- Live state: not published.

### 4. Mini Touch filter change and maintenance

- Product area: module `3 – Produkte`.
- Existing canonical maintenance lesson: none found.
- Canonical lesson ID/video ID: not assigned.
- Decision: hold as a distinct maintenance candidate; content-owner approval is required before creating a lesson.
- Final Academy filename and R2 key: intentionally unresolved.
- Live state: not published.

### 5. PPM/TDS meaning and interpretation limits

- Existing module: `10 – Testlabor`.
- Existing lesson position: `M10 / L02`.
- Canonical lesson ID: `video-ppm`.
- Canonical video ID: `ppm-bedeutung`.
- Selected candidate: `DE-ppm-testgeraet-bedeutung-aussagegrenzen-approved-v2-20260805.mp4`.
- Decision: replace the existing PPM video after the secure release gates pass; do not create another PPM lesson.
- Final asset name: `academy_m10_l02_ppm-bedeutung_de_approved_v2_20260805.mp4`
- R2 key: `academy/videos/de/m10/ppm-bedeutung/v2/academy_m10_l02_ppm-bedeutung_de_approved_v2_20260805.mp4`
- Future DE title: `Was zeigt ein PPM-Testgerät wirklich an?`
- Future EN title: `What does a PPM meter actually show?`
- Live state: unchanged.

### 6. Mini Touch display and water dispensing

- Product area: module `3 – Produkte`.
- Existing canonical lesson: none found.
- Overlap: related to the structure/tank candidate, but the learning focus is operation and dispensing.
- Canonical lesson ID/video ID: not assigned.
- Decision: content-owner review must decide between a consolidated Mini Touch lesson and separate didactic lessons.
- Final Academy filename and R2 key: intentionally unresolved.
- Live state: not published.

### 7. Sparkling Pro operation and system structure

- Confirmed product: Sparkling Pro, not Mini Touch or Flexible Touch.
- Product area: module `3 – Produkte`.
- Existing canonical Sparkling Pro lesson: none found. Only a product card exists.
- Canonical lesson ID/video ID: not assigned.
- Decision: hold as a candidate pending approval of a new canonical product lesson.
- Final Academy filename and R2 key: intentionally unresolved.
- Live state: not published.

### 8. Earlier PPM candidate

- Candidate: `Mxx-Lxx-DE-ppm-wert-bedeutung-approved-v1-20260801.mp4`.
- Comparison result: same duration, audio and decoded video frames as the selected PPM v2 candidate. SSIM is exactly `1.000000` for all channels.
- Decision: duplicate source/reference only; never create a second PPM lesson or active asset from it.
- Final Academy filename and R2 key: none; no upload planned.
- Live state: not published.

## Missing expected source material

`1000822993.mp4` and files matching `*wasserstoff*.mp4` were not found in the source workspace. Therefore the Russian molecular-hydrogen TV/reference material was not copied, renamed, uploaded or cataloged. Its intended status remains `SOURCE / REFERENCE`, never an automatically published Academy lesson.

Before future use, the source must be supplied and checked for rights, scientific context, medical claims and personal data. A later German lesson requires separate content, scientific and legal approval.

## Release gates before any active switch

1. Approve canonical lessons and IDs for undercounter, Mini Touch and Sparkling Pro content.
2. Provide a private R2 configuration without client-side secrets or public bucket URLs.
3. Implement or confirm a protected Academy R2 read path with allowlisted server-owned keys.
4. Upload each selected asset under a new key; never overwrite the current object.
5. Verify object size and `video/mp4` content type.
6. Verify authenticated range requests, playback and seek behavior.
7. Test mobile and desktop layouts, including the vertical source format.
8. Confirm approved-partner and admin access.
9. Confirm pending, blocked and unauthenticated requests are denied.
10. Only then update the canonical content mapping and DE/EN translation entries.
11. Keep the previous active videos available for rollback; archive before any separately approved deletion.

## Explicit non-changes

- No Academy module, lesson, card, navigation item or video mapping was added.
- No visible UI text or translation key was added.
- No authentication, partner approval, database, Supabase, RLS, progress, quiz or certificate code was changed.
- No R2 object was uploaded, deleted or exposed publicly.
- No source video was added to Git.
