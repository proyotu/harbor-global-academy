# Water Content Review Matrix

Stand: 2026-08-16
Scope: Harbor Global Partner Academy, read-only source audit plus P2 classification

## Classification model

| Classification | Meaning |
| --- | --- |
| `CONFIRMED` | Current canonical Harbor data or an official primary source supports the statement. |
| `EDUCATIONAL` | Neutral basic knowledge, phrased without a product or health promise. |
| `REFERENCE` | Useful for research, but not approved Harbor sales copy. |
| `REQUIRES_REVIEW` | Subject-matter, legal, currency, rights or product approval is still required. |
| `DO_NOT_USE_AS_CLAIM` | Must not be presented as a Harbor product, health or disease claim. |

## Reviewed Harbor sources

| Source | Topic | Status | Current? | Official? | Scientific? | Product claim? | Health claim? | Compliance risk | Academy use | Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `app/lib/academy-content.js` + `umkehrosmose-erklaerung` | Reverse osmosis | `CONFIRMED` | yes | canonical Academy | educational | limited | no | low when bounded | M03/L02 canonical video | retain; add principle and limitation summary only |
| `app/lib/academy-content.js` + `ppm-bedeutung` | PPM/TDS | `CONFIRMED` | yes | canonical Academy | educational | no | no | medium if overinterpreted | M10/L02 canonical video | retain; add “shows / does not show” guidance |
| `academy-videos/private/wasser-ist-leben.mp4` | water basics | `REQUIRES_REVIEW` | unclear | internal | not evidenced in catalog | possible | possible | high | reference for Module 2 | transcript and claim review before further reuse |
| `academy-videos/private/allgemeine-ernaehrungsweise.mp4` | nutrition | `REQUIRES_REVIEW` | unclear | internal | not evidenced in catalog | no | possible | high | reference only | health and nutrition review required |
| `academy-videos/private/funktionen-wasser-koerper.mp4` | body functions | `REQUIRES_REVIEW` | unclear | internal | not evidenced in catalog | no | yes possible | high | reference only | medical and scientific review required |
| `academy-videos/private/mineralien.mp4` | minerals | `REQUIRES_REVIEW` | unclear | internal | not evidenced in catalog | possible | possible | medium/high | reference for neutral definitions | transcript, source and claims review required |
| `academy-videos/private/grenzwerte.mp4` | limit values | `REQUIRES_REVIEW` | unclear | internal | not evidenced in catalog | possible | possible | high | reference only | legal version and source date required |
| `academy-videos/private/membranfilter-vs-filterkanne.mp4` | filter comparison | `REQUIRES_REVIEW` | unclear | internal | demonstration only | yes possible | no | medium | Test Lab reference | define test conditions; do not generalise results |
| `DOC_MA_Praesentation_Wasser.pdf` | water, limits, membrane filtration | `REQUIRES_REVIEW` | unclear | internal marketing | mixed/uncited | yes | yes possible | high | source inventory only | verify every number, technology statement and legal reference before reuse |
| `DOC_MA_Your_World.pdf` | products, RO, Hydrogen | `DO_NOT_USE_AS_CLAIM` for health pages; otherwise `REQUIRES_REVIEW` | partly current | internal marketing | references absent for reviewed claims | yes | yes | critical | product identity/reference only | do not publish health, disease, antioxidant or absolute filtration claims; obtain approved replacement copy |
| `DOC_AG_Vertriebspartner_Preisliste_Zusatzartikel.pdf` | Hydrogen Bottle identity | `CONFIRMED` for product name/listing only | dated 2026-03-01 | official price list | not applicable | price/listing only | no | low for identity, high if extended | establishes that Hydrogen Bottle Black/White products are listed | do not infer technology, H₂ output, cycle, care or effects |
| `docs/ACADEMY_CONTENT_REGISTRY.md` | inventory/status | `CONFIRMED` | yes | project governance | not applicable | no | no | low | source routing | retain as inventory, not scientific evidence |
| `docs/ACADEMY_VIDEO_BATCH_INTEGRATION_20260812.md` | missing H₂ video | `CONFIRMED` | yes | project audit | not applicable | no | no | low | proves no approved local H₂ video was found | keep external/Russian material `REFERENCE` only |
| Russian molecular-hydrogen TV/reference material (not locally present) | H₂ | `REFERENCE` | unknown | no | unknown | possible | likely | critical | none in production Academy | do not retrieve or publish without source, rights, science and compliance review |

## Reviewed external primary references

These sources support neutral educational definitions only. They do not approve a Harbor product claim.

| Source | Supported use | Classification | Constraint |
| --- | --- | --- | --- |
| [US EPA: Drinking Water Treatment Technologies](https://www.epa.gov/sdwa/overview-drinking-water-treatment-technologies) | RO uses pressure and a semipermeable membrane; performance varies by substances and system | `EDUCATIONAL` | no blanket product removal rate |
| [USGS: Water Science Glossary](https://www.usgs.gov/water-science-school/science/water-science-glossary) | conductivity can approximate TDS and reflects ions | `EDUCATIONAL` | a conductivity-derived estimate is not a complete analysis |
| [USGS: Salinity and TDS measurements](https://www.usgs.gov/publications/salinity-and-total-dissolved-solids-measurements-natural-waters-overview-and-a-new) | TDS is method-dependent and is not equivalent to every other salinity/solute measure | `EDUCATIONAL` | method and conditions must be stated |
| [IUPAC Gold Book: electrolyte](https://goldbook.iupac.org/terms/view/09061) | electrolyte/ion terminology | `EDUCATIONAL` | not a nutrition or product-performance claim |
| [PubChem: Hydrogen](https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen) | molecular formula H₂ and identity | `EDUCATIONAL` | therapeutic summaries are not adopted as Harbor claims |
| [US Department of Energy: Electrolysis](https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis) | electrolysis uses electricity to split water into hydrogen and oxygen | `EDUCATIONAL` | does not establish Harbor product technology |
| [EU Regulation 1924/2006](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32006R1924) | claims must comply with EU health-claim rules and must not mislead | `CONFIRMED` compliance reference | legal review remains required for concrete commercial wording |
| [EU Regulation 1169/2011](https://eur-lex.europa.eu/legal-content/DE-EN/ALL/?uri=CELEX%3A32011R1169) | food information must not attribute disease prevention, treatment or cure | `CONFIRMED` compliance reference | not a complete legal assessment of every Harbor product |
| [EU Register of Health Claims](https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims/eu-register-health-claims_en) | approved/non-approved health-claim lookup | `CONFIRMED` compliance reference | each proposed claim needs its own eligibility/conditions check |

## Missing official data

The following remain `OFFICIAL_SOURCE_REQUIRED`:

- Hydrogen Bottle operating principle and confirmed electrode/electrolyte/PEM/SPE design
- H₂ concentration, unit, cycle duration, measurement method and tolerances
- cleaning, care, service life, warnings and certifications for the Hydrogen Bottle
- approved written reduction-performance data for each RO product and substance group
- approved mineral and electrolyte composition for any product or prepared water
- validated PPM/TDS meter model, conversion factor, calibration and temperature-compensation instructions
- legally approved Harbor wording for every nutrition or health claim

## Publication decision

- Publish only the bounded educational definitions implemented in P2.
- Keep M03/L02 and M10/L02 canonical; do not create duplicate RO or PPM lessons.
- Do not publish the reviewed historical Hydrogen and health pages.
- Do not create a Hydrogen Bottle lesson until the missing official product package and reviews are complete.
