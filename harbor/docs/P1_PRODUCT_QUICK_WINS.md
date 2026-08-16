# P1 Product Quick Wins

Date: 2026-08-13
Scope: Module 3 – Products
Release state: Preview-verified, not committed and not deployed to Production

## Existing product structure

Before this sprint, Module 3 contained the product overview, the canonical reverse-osmosis lesson (`video-osmosis`) and product documents. Mini Touch, the undersink system and Sparkling Pro appeared as product context but had no canonical Academy video lesson or video ID. The existing private Academy video route, server-owned allowlist and R2 source model are reused without architectural changes.

## Final lesson architecture

| Position | Product | Lesson ID | Video ID | Decision |
| --- | --- | --- | --- | --- |
| M03/L03 | Mini Touch | `video-mini-touch-aufbau-wassertank` | `mini-touch-aufbau-wassertank` | New canonical lesson |
| M03/L04 | Mini Touch | `video-mini-touch-touchdisplay-wasserausgabe` | `mini-touch-touchdisplay-wasserausgabe` | New canonical lesson |
| M03/L05 | Mini Touch | `video-mini-touch-filterwechsel-wartung` | `mini-touch-filterwechsel-wartung` | New canonical lesson |
| M03/L06 | Undersink system | `video-untertischanlage-bedienung-flush-wartung` | `untertischanlage-bedienung-flush-wartung` | New canonical lesson |
| M03/L07 | Sparkling Pro | `video-sparkling-pro-bedienung-systemaufbau` | `sparkling-pro-bedienung-systemaufbau` | New canonical lesson |

The existing reverse-osmosis lesson remains M03/L02. The PPM/TDS lesson remains M10/L02. No lesson, card or video display was duplicated.

## Mini Touch deduplication decision

Option A (three lessons) is used. The source videos overlap only at product orientation level; their actionable learning goals are distinct:

1. device setup and removable water tank;
2. touch display and daily water dispensing;
3. filter replacement, filter status and maintenance.

Combining the first two would produce an unnecessarily long mixed lesson, while combining maintenance with daily operation would make task retrieval harder. Each source therefore has one canonical lesson and appears nowhere else in full.

## Approved video assets

| Video ID | Final filename | Bytes | Duration | Resolution | SHA-256 |
| --- | --- | ---: | ---: | --- | --- |
| `mini-touch-aufbau-wassertank` | `academy_m03_l03_mini-touch-aufbau-wassertank_de_approved_v1_20260805.mp4` | 23,509,385 | 00:04:53 | 352×624 | `B7B39D18075B6AF56E95B3F4DF506AACB8CA9489088E672D25D4C702A7DC9DA5` |
| `mini-touch-touchdisplay-wasserausgabe` | `academy_m03_l04_mini-touch-touchdisplay-wasserausgabe_de_approved_v1_20260805.mp4` | 22,948,059 | 00:04:38 | 352×624 | `38CEF4265C776D14430C2F12A459E4E3F18DC7554F5B82FD3BE8587F90074ABB` |
| `mini-touch-filterwechsel-wartung` | `academy_m03_l05_mini-touch-filterwechsel-wartung_de_approved_v1_20260805.mp4` | 22,948,327 | 00:03:11 | 576×1024 | `05EFF69C2003992DD7BEFD8932E7C3A86CFFF0F2A93A850AFBB656088C0527AB` |
| `untertischanlage-bedienung-flush-wartung` | `academy_m03_l06_untertischanlage-bedienung-flush-wartung_de_approved_v1_20260805.mp4` | 35,967,479 | 00:05:06 | 576×1024 | `A5EAB1443E241D460B5EAF20D49B07E66BD43D17B1C35C615A856BE5320A56C9` |
| `sparkling-pro-bedienung-systemaufbau` | `academy_m03_l07_sparkling-pro-bedienung-systemaufbau_de_approved_v1_20260812.mp4` | 29,384,360 | 00:04:08 | 576×1024 | `0DF3CA67994A748A47D69BE6FC62792E187E919416A11C3B7B4425EFC8E03A54` |

All sources are H.264 MP4 (`yuv420p`) and passed a complete FFmpeg decode. Source MP4 files remain outside Git.

## Private R2 keys

- `academy/videos/de/m03/mini-touch-aufbau-wassertank/v1/academy_m03_l03_mini-touch-aufbau-wassertank_de_approved_v1_20260805.mp4`
- `academy/videos/de/m03/mini-touch-touchdisplay-wasserausgabe/v1/academy_m03_l04_mini-touch-touchdisplay-wasserausgabe_de_approved_v1_20260805.mp4`
- `academy/videos/de/m03/mini-touch-filterwechsel-wartung/v1/academy_m03_l05_mini-touch-filterwechsel-wartung_de_approved_v1_20260805.mp4`
- `academy/videos/de/m03/untertischanlage-bedienung-flush-wartung/v1/academy_m03_l06_untertischanlage-bedienung-flush-wartung_de_approved_v1_20260805.mp4`
- `academy/videos/de/m03/sparkling-pro-bedienung-systemaufbau/v1/academy_m03_l07_sparkling-pro-bedienung-systemaufbau_de_approved_v1_20260812.mp4`

All five objects were uploaded privately. No public URL is required or exposed. The object bytes and SHA-256 values match the local approved sources.

## Preview verification

The isolated Preview deployment used the existing Harbor Vercel project and server-side Preview environment. For every video, the protected Academy route returned:

- full request: `200` with matching `Content-Length` and `Content-Type: video/mp4`;
- start, middle, end, open-ended and suffix ranges: `206` with `Accept-Ranges: bytes` and valid `Content-Range`;
- invalid out-of-bounds range: `416`.

The known video ID returned `401` without a session. Existing automated authorization tests cover approved Partner and Leader access plus `403` for Pending, Blocked, Rejected and Paused states. No production account was created. A real authenticated desktop/mobile playback session was not available; visual Play/Pause/Seek remains a manual release check and is not reported as passed.

## Localization and claims

German and English titles, descriptions and learning goals are defined in the existing localized Academy content catalog. Other configured languages use the established fallback. No prices, health promises, temperatures or unverified technical claims were transcribed from the videos into visible Academy copy.

## Rollback

Before Production release, rollback is simply omission or reversion of the five catalog and allowlist mappings. The approved local source files and the private R2 objects remain intact. No existing Academy video or object was deleted or overwritten.

## Open reviews and TODOs

- Perform authenticated Preview playback for desktop and mobile/responsive layouts when a safe approved test session is available.
- Product owners should separately review any spoken technical or maintenance claim before extracting it into written learning material.
- Do not remove source or R2 assets without a separate retention decision.
