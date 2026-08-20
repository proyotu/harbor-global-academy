# Water Knowledge & Compliance Blueprint

Stand: 2026-08-16

## Goal

Give partners a concise, mobile-first foundation for explaining water treatment and measurements responsibly. This is product education, not medical education. It must not diagnose, treat, prevent or promise outcomes for disease.

## Source hierarchy

1. **Tier A – canonical:** current official product data, approved manufacturer information and canonical Academy records.
2. **Tier B – internal training:** Harbor videos, scripts and presentations after subject-matter, legal, currency and rights review.
3. **Tier C – research/reference:** external media, older brochures and historical presentations. Never promoted automatically to an official Harbor claim.

The implementation uses neutral primary references for basic science and current EU primary sources for the compliance boundary. No external reference establishes product performance.

## Canonical architecture

No new module, navigation level or duplicate lesson is introduced.

| Knowledge area | Canonical location | P2 use |
| --- | --- | --- |
| water, H₂, H₂O, electrolytes, minerals, electrolysis | Module 2 `basics-overview` | compact definition and comparison cards |
| reverse osmosis/membrane | M03/L02 `video-osmosis` / `umkehrosmose-erklaerung` | existing video plus bounded principle/limitations |
| PPM/TDS | M10/L02 `video-ppm` / `ppm-bedeutung` | existing video plus “shows / does not show” panel |
| Hydrogen Bottle | not released | transparent `OFFICIAL_SOURCE_REQUIRED` preparation state only |

Product lessons remain in Module 3. Water Knowledge links conceptually to them but does not repeat their operating instructions.

## Knowledge architecture

### Water and dissolved matter

- H₂O identifies the water molecule.
- Dissolved substances are not the same as suspended particles.
- Minerals may occur as dissolved ions, but their identity and amount require an appropriate analysis.

### Reverse osmosis

- Pressure moves water through a semipermeable membrane.
- A treated stream and a concentrate stream are produced.
- Retention depends on the membrane/system, substance properties and operating conditions.
- Never derive “removes everything” or a 100% claim from the general principle.
- Specific substances, rates and certifications require current approved product evidence.

### PPM / TDS

“PPM” is a unit expression; “TDS” is a defined measurement concept. Handheld meters commonly estimate TDS from conductivity. The UI therefore says what a reading can support and what it cannot establish.

It may support:

- method-consistent comparison of dissolved-constituent estimates;
- trend observation under comparable device, unit and temperature conditions.

It does not identify:

- individual substances or their individual concentrations;
- microorganisms or microbiological safety;
- medical purity, a health risk or therapeutic effect;
- complete water quality from a single number.

### H₂, H₂O, electrolytes and minerals

- **H₂:** neutral molecular hydrogen; it can be dissolved in water.
- **H₂O:** the water molecule.
- **Electrolyte:** a substance/medium providing mobile ions for ionic conduction.
- **Minerals:** may contribute ions, but are not synonymous with H₂.
- More H₂ does not mean more minerals, and H₂ is not an electrolyte claim.

No health effect of dissolved H₂ is taught or claimed.

### Electrolysis

The general educational statement is limited to: electricity can split water into hydrogen and oxygen in an electrolyser using electrodes and an electrolyte. P2 does not state that any Harbor product uses a specific PEM, SPE, electrode, membrane, voltage or cycle because no current approved product specification was found.

## Hydrogen Bottle future lesson

Proposed sequence after approval:

1. product identity and intended use;
2. approved operating steps;
3. confirmed technical principle;
4. H₂ terminology;
5. confirmed cleaning and care;
6. approved measurement method;
7. reviewed FAQ;
8. legally approved customer wording.

Required before implementation: current official manual/datasheet, approved technical values, warnings, certifications, measurement instructions, copyright clearance, subject-matter review and legal claim review.

## Safe customer language

### Better wording

- Explain that the device uses reverse osmosis and that actual performance depends on the tested system.
- Explain that one PPM/TDS reading does not describe overall water quality.
- Explain H₂ as dissolved molecular hydrogen, separate from minerals and electrolytes.
- Describe observations and measurements without extrapolating a diagnosis or guaranteed benefit.

### Do not use without explicit approval

- cures, prevents or treats cancer, diabetes, inflammation or any disease;
- guarantees lower blood pressure or any health outcome;
- detoxifies the body;
- replaces medicine, diagnosis or medical treatment;
- removes everything or guarantees 100% removal;
- “0 PPM means completely healthy, sterile or medically pure water”;
- Hydrogen water is proven to cure disease.

The binding internal rule is not a substitute for legal advice: any health/disease claim requires explicit legal and subject-matter approval and must meet its concrete conditions of use.

## Claim classification

- `CONFIRMED`: current canonical or official evidence.
- `EDUCATIONAL`: neutral foundational explanation.
- `REFERENCE`: research input only.
- `REQUIRES_REVIEW`: approval/evidence gap.
- `DO_NOT_USE_AS_CLAIM`: prohibited from partner claim use.

P2 stores this classification as code metadata only; no database or workflow is introduced.

## UI model

- one reusable `WaterKnowledgePanel` rendered only at the three canonical lessons;
- one reusable `WaterKnowledgeComplianceNote` at the central foundations location;
- single-column cards on mobile, two columns only when space permits;
- status expressed in text, not colour alone;
- semantic headings, lists and aside; decorative icons are hidden from assistive technology;
- all visible P2 copy resolves through `createI18nTranslator()` with complete DE/EN entries and the existing fallback for other languages.

## Quiz TODO

No quiz or certificate behaviour changes in P2. The prepared question IDs are:

- `ppm-measurement-boundary`
- `ppm-total-quality-boundary`
- `hydrogen-vs-water`
- `hydrogen-vs-electrolytes`
- `reverse-osmosis-principle`
- `health-claim-boundary`

Future integration must review translations, answers and certificate impact before activation.

## Cheat-sheet TODO

Prepare “Water knowledge – explained quickly” from the approved UI copy only. It should cover RO, membrane, PPM/TDS, H₂, electrolytes, electrolysis, customer wording and the claim warning. No PDF is generated until the existing download pipeline, ownership and approval are confirmed.

## Rollout and rollback

Rollout scope is limited to two new code files, three canonical lesson metadata links, DE/EN translation keys, documentation, tests and changelog. Rollback removes the `knowledgeId` metadata and P2 component import/rendering; videos, R2 mappings, lesson IDs and progress remain untouched.

## Open reviews

- Hydrogen Bottle official technical/product package
- legal approval of concrete commercial claims
- scientific review of all historical body/health/H₂ content
- current product-specific RO performance documents
- rights and currency review for both historical water PDFs
- device-specific PPM/TDS operating and calibration instructions
