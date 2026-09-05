# Field Intelligence — Frontend Design Specification

## Purpose

This document defines the approved visual and interaction design for the Field Intelligence frontend.

The PNG files in this directory are the primary visual references.

Reference screens:

- `home.png`
- `scanner.png`
- `specimen-reveal.png`
- `collection.png`
- `dossier.png`

The goal is to implement this design into the existing Next.js application.

This is NOT a request to recreate the Stitch HTML.

The existing repository architecture and functionality remain the technical source of truth.

---

# 1. Product Identity

Field Intelligence is a botanical field-intelligence application combining:

- real plant image recognition
- on-device ONNX inference
- botanical information
- specimen discovery
- personal plant collection
- botanical research assistance

The visual identity combines:

**Premium scientific field instrument**

with

**Pixel-art botanical personality**

and

**Collectible specimen experience**

The product should feel:

- scientific
- premium
- calm
- curious
- memorable
- slightly playful

It should NOT feel:

- childish
- arcade-like
- generic SaaS
- generic AI chatbot
- military cockpit
- overloaded dashboard

---

# 2. Core User Journey

The primary experience is:

SCAN
↓
ANALYZE
↓
IDENTIFY
↓
SPECIMEN REVEAL
↓
DISCOVER / RECORD
↓
FIELD COLLECTION
↓
SPECIES DOSSIER
↓
BOTANICAL GUIDE

The specimen reveal is the signature interaction.

The user should feel:

"I found something."

"I identified it."

"I added it to my collection."

"I want to find another one."

---

# 3. Visual Foundation

Preserve the approved Field Intelligence visual system.

## Colors

Primary foundation:

- near-black / obsidian
- dark charcoal
- deep neutral surfaces

Accent colors:

- emerald = primary action / positive state
- cyan = secondary information / technical accent
- amber = warning / attention
- restrained red = critical conservation or error state

Do not introduce a large new color palette.

Do not copy the colors from the pixel-art reference image.

The reference image provides inspiration for pixel-art styling only.

---

# 4. Typography

Preserve the existing typography direction:

### Primary

Space Grotesk

Used for:

- headings
- navigation
- primary labels
- buttons
- major specimen names

### Technical

JetBrains Mono

Used for:

- specimen numbers
- technical metadata
- status labels
- small system information
- collection counters

Do not introduce unnecessary additional fonts.

---

# 5. Pixel-Art Language

Pixel art is a CORE personality layer of the application.

It should be clearly visible but used selectively.

Use:

- pixel botanical icons
- pixel plant sprites
- pixel silhouettes
- pixel leaves
- pixel flowers
- pixel specimen markers
- small pixel decorative elements
- original pixel botanical mascot

Pixel artwork should have:

- crisp edges
- limited colors
- dark outlines
- emerald/cyan/amber compatibility
- simple recognizable silhouettes

The pixel-art style should feel like a sophisticated digital field instrument.

It should NOT become a full 8-bit game interface.

Do not decorate every element with pixels.

Pixel art should be most prominent in:

- specimen cards
- discovery moments
- collection
- scanner processing
- empty states
- mascot interactions

---

# 6. Botanical Mascot

Use one consistent original pixel botanical mascot.

The mascot is a small digital field companion.

It can appear in:

- scanner processing
- specimen discovery
- empty collection state
- botanical guide
- onboarding
- low-confidence state

The mascot should remain secondary to the actual plant.

Do not create multiple unrelated mascot designs.

Do not use Pokémon or other copyrighted game characters.

Do not use the word "Pokédex".

---

# 7. Specimen Cards

Specimen cards are one of the primary components of the application.

They should feel collectible while remaining scientifically credible.

A discovered specimen card can contain:

- botanical image
- pixel botanical icon
- common name
- scientific name
- specimen number
- discovered state
- conservation status when available

Keep cards visually clean.

Avoid turning cards into database tables.

Undiscovered cards should use:

- pixel plant silhouette
- locked/undiscovered state
- muted information
- subtle mystery

Do not reveal or invent information that is unavailable.

---

# 8. Specimen Reveal

The specimen reveal is the signature experience.

Successful scan flow:

SCAN
↓
ANALYZE
↓
PIXEL BOTANICAL EFFECT
↓
SPECIMEN CARD REVEAL
↓
NEW DISCOVERY or REPEAT RECORD
↓
COLLECTION UPDATED

Recommended visual sequence:

1. Scanner transitions into a focused reveal state.
2. Background becomes slightly subdued.
3. Pixel botanical elements assemble.
4. Specimen frame appears.
5. Plant image is revealed.
6. Common name appears.
7. Scientific name appears.
8. Specimen number appears.
9. Discovery state appears.
10. Research points may appear if supported by the application.
11. User can open the dossier.
12. User can continue scanning.

The reveal should feel rewarding through:

- spacing
- motion
- scale
- pixel animation
- progressive information reveal

Do not overwhelm the reveal with large amounts of metadata.

---

# 9. Collection

The collection represents the plants discovered by the current user.

Primary hierarchy:

FIELD COLLECTION

X / TOTAL SPECIES DISCOVERED

Then:

- discovered specimens
- undiscovered specimens

The collection should feel like building a personal field archive.

Use:

- specimen cards
- pixel botanical sprites
- undiscovered silhouettes
- discovery indicators
- conservation status where available

Do not make all species discovered by default.

Collection state should reflect actual user activity.

---

# 10. Home

The home screen should immediately communicate:

WHAT IS THIS?
→ botanical identification

WHAT DO I DO?
→ scan a plant

WHY SHOULD I CONTINUE?
→ discover and build my collection

Primary action:

SCAN PLANT

Secondary content:

- recent discoveries
- collection progress
- subtle botanical pixel elements
- mascot where appropriate

Do not overload the home screen with technical telemetry.

---

# 11. Scanner

The scanner should be immersive and simple.

Primary purpose:

CAPTURE A PLANT

Supported interactions:

- camera
- image capture
- upload fallback

The scanner should use the real existing application functionality.

Use subtle pixel-art elements for:

- scan processing
- reticle
- transitions
- discovery feedback

Do not add fictional:

- GPS
- LiDAR
- compass
- spectral scanning
- target distance
- camera telemetry
- sensor readings

---

# 12. Species Dossier

The dossier is the detailed scientific view of an identified species.

Scientific information is dominant.

Use:

- actual plant name
- scientific name
- actual available plant information
- conservation status when available
- endemic status when available
- botanical image

Pixel art should be a supporting personality element rather than the dominant visual.

Do not invent scientific information.

---

# 13. Botanical Guide

The guide should feel like a botanical field assistant.

It should NOT look like a generic AI chatbot.

Use:

- existing dark visual system
- scientific typography
- restrained pixel botanical mascot
- simple conversational layout

The existing `/api/guide` functionality must be preserved.

---

# 14. Compare

The comparison experience should allow users to compare real species information.

Only display attributes supported by the existing plant data.

Do not invent comparison metrics.

The visual treatment should use specimen-card components rather than generic tables wherever practical.

---

# 15. Responsive Design

The application must work on:

- phone
- tablet
- laptop
- desktop

Important target sizes:

375 × 812
390 × 844
768 × 1024
1280 × 800
1440 × 900

## Mobile

Prioritize:

- thumb-friendly controls
- immersive scanner
- vertical specimen reveal
- compact specimen cards
- simple navigation

## Desktop

Use the additional space for:

- wider scanner workspace
- multi-column collection
- larger specimen reveal
- two-column dossier layouts
- comfortable spacing

Do NOT simply stretch the mobile layout onto desktop.

---

# 16. Visual Hierarchy

Every screen should have:

ONE primary purpose.

ONE primary action.

ONE dominant visual element.

Use whitespace and contrast to establish hierarchy.

Do not fill empty space simply because it is available.

Avoid excessive:

- badges
- borders
- metrics
- labels
- technical readouts
- decorative elements

When uncertain:

REMOVE rather than ADD.

---

# 17. Data Integrity

The existing repository is the source of truth.

Never invent:

- species
- scientific names
- conservation statuses
- habitats
- locations
- GPS coordinates
- ecological facts
- herbarium records
- voucher records
- accession systems
- sensor measurements
- camera telemetry
- model performance metrics
- spectral information
- target distance

If data is unavailable:

Do not fabricate it.

Use a simpler UI state instead.

---

# 18. Existing Functionality Must Be Preserved

The frontend must integrate with the existing application.

Known real functionality includes:

- camera access
- image upload
- client-side ONNX inference
- confidence scoring
- plant identification
- `/api/classify`
- `/api/guide`

Do not replace the existing classifier with mock logic.

Do not hardcode a fake plant result.

Do not hardcode fake confidence values.

Do not create a second backend.

---

# 19. Protected Backend / Shared Files

These files are not part of the frontend redesign.

Do not modify:

app/api/**

lib/retrieval.ts

lib/contextbuilder.ts

lib/gemini.ts

data/plantDatabase.ts

Treat the following as read-only unless an unavoidable technical issue is identified:

lib/plantClassifier.ts

types/plant.ts

types/api.ts

model files

package configuration

Do not add dependencies unless genuinely necessary.

---

# 20. Frontend Implementation Area

The primary implementation area is:

app/

components/

frontend state/hooks

styles

Allowed page areas include:

app/page.tsx

app/scanner/page.tsx

app/species/[id]/page.tsx

app/explore/page.tsx

app/discoveries/page.tsx

app/compare/page.tsx

app/guide/page.tsx

Create reusable components when appropriate.

Examples:

- SpecimenCard
- SpecimenReveal
- PixelMascot
- CollectionGrid
- ScannerView
- DiscoveryAnimation
- StatusBadge
- Navigation

Avoid duplicating large amounts of UI between pages.

---

# 21. Required UX States

Implement polished states for:

- camera permission denied
- camera unavailable
- upload fallback
- image processing
- classification loading
- successful identification
- low-confidence identification
- classification failure
- guide network failure
- first discovery
- repeat observation
- empty collection
- undiscovered collection
- comparison with no selection

All states should use the same visual system.

---

# 22. Terminology

Preferred product language:

FIELD COLLECTION

SPECIMEN

DISCOVERY

FIELD RECORD

SPECIES

DISCOVERED

UNDISCOVERED

NEW DISCOVERY

COLLECTED

Do NOT use:

Pokédex

Pokémon

Poké Ball

or terminology directly associated with another game franchise.

The product has its own identity.

---

# 23. Design Priority

When implementing the design, prioritize in this order:

1. Usability
2. Real functionality
3. Visual hierarchy
4. Specimen discovery experience
5. Collection experience
6. Pixel-art personality
7. Decorative details

A beautiful effect should never break the actual scanner or identification flow.

---

# 24. Final Design Principle

The final application should feel like:

A PREMIUM BOTANICAL FIELD COMPUTER

with

A PIXEL-ART BOTANICAL SOUL.

The user should immediately understand:

SCAN
→ DISCOVER
→ COLLECT
→ LEARN

The pixel-art language makes Field Intelligence memorable.

The scientific interface makes it credible.

The specimen collection makes it engaging.

Keep the balance.