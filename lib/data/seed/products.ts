import { deriveStockStatus } from "@/lib/utils/stock-status";
import type { Product, ProductFacetTag, ProductVariant } from "@/lib/data/types";
import { findFacet } from "@/lib/data/seed/facets";

const LOW_STOCK_THRESHOLD = 10;

function variant(sizeLabel: string, price: number, stockQuantity: number, sku: string): ProductVariant {
  return {
    id: sku,
    sizeLabel,
    price,
    currency: "NGN",
    stockQuantity,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    stockStatus: deriveStockStatus(stockQuantity, LOW_STOCK_THRESHOLD),
    sku,
  };
}

function tags(slugs: string[]): ProductFacetTag[] {
  return slugs.map((slug) => {
    const facet = findFacet(slug);
    if (!facet) throw new Error(`Unknown facet slug in seed data: ${slug}`);
    return facet;
  });
}

/**
 * Real product photography (public/images/products/) — actual Sofa Organics stock.
 * Wellness-support copy only, per PRD §4.2 — no disease-cure language.
 */
const REAL_PRODUCTS: Product[] = [
  {
    id: "p-cayenne-pepper",
    name: "Cayenne Pepper",
    slug: "cayenne-pepper",
    description:
      "Ground from sun-ripened cayenne pods, this fiery red powder is a kitchen staple across West African cooking and a traditional pick for warming, circulation-supporting blends. Stir a pinch into teas, soups, or tonics. Traditionally used to support healthy circulation and metabolism as part of a balanced diet.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "/images/products/cayenne-pepper.jpeg", alt: "Sofa Organics Cayenne Pepper kraft pouch beside a bowl of ground cayenne and fresh chillies", isPlaceholder: false }],
    variants: [
      variant("100g", 3500, 42, "SO-CAY-100"),
      variant("250g", 7500, 18, "SO-CAY-250"),
      variant("500g", 13500, 6, "SO-CAY-500"),
      variant("1kg", 24000, 0, "SO-CAY-1000"),
    ],
    facets: tags(["powders", "african", "metabolic-wellness", "heart-health", "digestion-gut-health"]),
  },
  {
    id: "p-chia-seeds",
    name: "Chia Seeds",
    slug: "chia-seeds",
    description:
      "Whole, unroasted chia seeds with their natural mottled black-and-white color intact. Soak into puddings, stir into smoothies, or fold into baking. A traditional gut-and-heart-supporting staple, valued for its fibre and natural mucilage. A small amount is a common addition to pet meals — see the pet-safe notes below for guidance.",
    status: "published",
    isPetSafe: true,
    petSafeNote:
      "A teaspoon of soaked (never dry) chia seeds is a common addition to a dog's meal for fibre. Introduce gradually and always soak first — dry seeds can swell in the throat. Check with your vet for cats or animals with existing conditions.",
    images: [{ src: "/images/products/chia-seeds.jpeg", alt: "Sofa Organics Chia Seeds kraft pouch showing the whole seeds through the window", isPlaceholder: false }],
    variants: [
      variant("100g", 2800, 55, "SO-CHI-100"),
      variant("250g", 6000, 30, "SO-CHI-250"),
      variant("500g", 10500, 12, "SO-CHI-500"),
      variant("1kg", 19000, 8, "SO-CHI-1000"),
    ],
    facets: tags(["seeds-spices", "african", "digestion-gut-health", "heart-health", "metabolic-wellness"]),
  },
  {
    id: "p-gingko-leaves",
    name: "Gingko Leaves",
    slug: "gingko-leaves",
    description:
      "Dried, hand-cut gingko biloba leaves for steeping into tea or preparing your own tincture. One of the oldest botanicals in traditional practice, gingko is reached for as part of routines built around focus and mental clarity. Steep 1–2 teaspoons in hot water for 8–10 minutes.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "/images/products/gingko-leaves.jpeg", alt: "Sofa Organics Gingko Leaves kraft pouch beside a bowl of dried leaves, a wooden spoon, and a dropper bottle", isPlaceholder: false }],
    variants: [
      variant("100g", 4200, 38, "SO-GIN-100"),
      variant("250g", 9000, 14, "SO-GIN-250"),
      variant("500g", 16000, 4, "SO-GIN-500"),
    ],
    facets: tags(["whole-leaves", "ayurvedic", "memory-focus"]),
  },
  {
    id: "p-moringa-root-extract-powder",
    name: "Moringa Root Extract Powder",
    slug: "moringa-root-extract-powder",
    description:
      "A concentrated extract powder milled from moringa root, a plant long relied on across West African herbal practice. Mix a small measure into water or juice. Traditionally used to support the body's natural defenses and everyday vitality — start with a small amount to see how it suits you.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "/images/products/moringa-root-extract-powder.jpeg", alt: "Sofa Organics Moringa Root Extract Powder kraft pouch showing the fine tan powder through the window", isPlaceholder: false }],
    variants: [
      variant("100g", 4800, 26, "SO-MOR-100"),
      variant("250g", 10500, 9, "SO-MOR-250"),
      variant("500g", 19000, 0, "SO-MOR-500"),
    ],
    facets: tags(["powders", "african", "immune-support", "male-reproductive-health"]),
  },
];

/**
 * Realistic placeholder catalog — named directly from PRD §5.1's product list.
 * No real photography yet (flagged as a content-production task); styled label
 * placeholders only, matching the mockup's own placeholder pattern.
 */
const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: "p-castor-oil",
    name: "Hexane-Free Castor Oil",
    slug: "hexane-free-castor-oil",
    description:
      "Cold-pressed and hexane-free, this thick, pale-gold castor oil is a scalp and skin staple across both African and Ayurvedic beauty traditions. Warm a small amount between your palms before massaging into hair ends or dry skin.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Amber glass bottle of hexane-free castor oil", isPlaceholder: true }],
    variants: [
      variant("100ml", 5200, 33, "SO-CAS-100"),
      variant("250ml", 11000, 20, "SO-CAS-250"),
      variant("500ml", 19500, 7, "SO-CAS-500"),
    ],
    facets: tags(["oils", "ayurvedic", "hair-care", "skin-care"]),
  },
  {
    id: "p-triphala",
    name: "Triphala Powder",
    slug: "triphala-powder",
    description:
      "A traditional Ayurvedic blend of three dried fruits — amla, bibhitaki, and haritaki — ground fine. Stirred into warm water, it's one of the most reached-for staples for everyday digestive support in Ayurvedic practice.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Bowl of fine olive-toned triphala powder", isPlaceholder: true }],
    variants: [
      variant("100g", 3200, 40, "SO-TRI-100"),
      variant("250g", 7000, 22, "SO-TRI-250"),
      variant("500g", 12500, 10, "SO-TRI-500"),
    ],
    facets: tags(["powders", "ayurvedic", "digestion-gut-health"]),
  },
  {
    id: "p-ashwagandha-root",
    name: "Ashwagandha Root",
    slug: "ashwagandha-root",
    description:
      "Whole, dried ashwagandha root pieces for simmering into a traditional decoction. A cornerstone of Ayurvedic practice, ashwagandha is reached for as part of routines built around steady stress response and restful sleep.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Dried whole ashwagandha root pieces in a wooden bowl", isPlaceholder: true }],
    variants: [
      variant("100g", 3800, 29, "SO-ASH-100"),
      variant("250g", 8200, 11, "SO-ASH-250"),
      variant("500g", 15000, 0, "SO-ASH-500"),
    ],
    facets: tags(["roots", "ayurvedic", "stress-sleep-support", "hormonal-balance"]),
  },
  {
    id: "p-manjakani",
    name: "Manjakani (Oak Galls)",
    slug: "manjakani-oak-galls",
    description:
      "Dried oak galls, ground to a fine powder, drawn from a women's wellness tradition practiced across South and Southeast Asia. Traditionally prepared as a wash as part of postpartum and everyday feminine care routines.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Fine grey-brown manjakani powder in a small ceramic dish", isPlaceholder: true }],
    variants: [
      variant("100g", 6500, 17, "SO-MAN-100"),
      variant("250g", 14000, 5, "SO-MAN-250"),
    ],
    facets: tags(["powders", "ayurvedic", "female-reproductive-health", "skin-care"]),
  },
  {
    id: "p-olive-leaves",
    name: "Olive Leaves",
    slug: "olive-leaves",
    description:
      "Whole, air-dried olive leaves for a mild, herbaceous infusion. A staple of Mediterranean-African herbal tradition, olive leaf tea is a longstanding pick for everyday immune and heart-health routines.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Dried whole olive leaves in a linen-lined bowl", isPlaceholder: true }],
    variants: [
      variant("100g", 3000, 48, "SO-OLV-100"),
      variant("250g", 6500, 26, "SO-OLV-250"),
      variant("500g", 11500, 9, "SO-OLV-500"),
    ],
    facets: tags(["whole-leaves", "african", "immune-support", "heart-health", "blood-pressure-support"]),
  },
  {
    id: "p-wormwood",
    name: "Wormwood",
    slug: "wormwood",
    description:
      "Dried wormwood leaf and stem, cut for steeping into a traditional bitter infusion. Long used across African herbal practice as part of routines built around digestive comfort. Its flavor is intensely bitter by design — start with a short steep.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Dried wormwood leaf and stem in a wooden bowl", isPlaceholder: true }],
    variants: [
      variant("100g", 3400, 31, "SO-WRM-100"),
      variant("250g", 7200, 15, "SO-WRM-250"),
    ],
    facets: tags(["whole-leaves", "african", "digestion-gut-health"]),
  },
  {
    id: "p-black-walnut-hull",
    name: "Black Walnut Hull",
    slug: "black-walnut-hull",
    description:
      "Dried, cracked black walnut hull for simmering into a traditional decoction. A longstanding African herbal staple, reached for as part of digestive-support and clear-skin routines.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Dried black walnut hull pieces in a wooden bowl", isPlaceholder: true }],
    variants: [
      variant("100g", 3600, 24, "SO-BWH-100"),
      variant("250g", 7800, 8, "SO-BWH-250"),
    ],
    facets: tags(["barks", "african", "digestion-gut-health", "skin-care"]),
  },
  {
    id: "p-cloves",
    name: "Whole Cloves",
    slug: "whole-cloves",
    description:
      "Sun-dried whole clove buds with their deep, warming aroma intact. A cooking and wellness staple in equal measure — simmer a few into tea, or grind fresh as needed for the fullest flavor and support for everyday digestion and immunity.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Whole dried clove buds in a small wooden bowl" , isPlaceholder: true }],
    variants: [
      variant("100g", 2600, 60, "SO-CLV-100"),
      variant("250g", 5600, 34, "SO-CLV-250"),
      variant("500g", 10000, 19, "SO-CLV-500"),
    ],
    facets: tags(["seeds-spices", "african", "digestion-gut-health", "immune-support"]),
  },
  {
    id: "p-avocado-oil",
    name: "Avocado Oil",
    slug: "avocado-oil",
    description:
      "Cold-pressed, deep-green avocado oil, rich and fast-absorbing. A West African beauty-routine staple for softening dry skin and taming stubborn hair ends.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Amber glass bottle of deep-green avocado oil", isPlaceholder: true }],
    variants: [
      variant("100ml", 4600, 27, "SO-AVO-100"),
      variant("250ml", 9800, 12, "SO-AVO-250"),
    ],
    facets: tags(["oils", "african", "skin-care", "hair-care"]),
  },
  {
    id: "p-jojoba-oil",
    name: "Jojoba Oil",
    slug: "jojoba-oil",
    description:
      "Light, close-to-skin's-own jojoba oil that absorbs without a greasy finish. A gentle daily pick for face, body, and scalp — and a common base oil in homemade pet paw and nose balms.",
    status: "published",
    isPetSafe: true,
    petSafeNote:
      "A widely used base oil in DIY paw-balm recipes thanks to its gentle, non-greasy profile. Use a light layer and keep it away from your pet's eyes.",
    images: [{ src: "", alt: "Amber dropper bottle of golden jojoba oil", isPlaceholder: true }],
    variants: [
      variant("100ml", 5000, 21, "SO-JOJ-100"),
      variant("250ml", 10800, 3, "SO-JOJ-250"),
    ],
    facets: tags(["oils", "african", "skin-care", "hair-care"]),
  },
  {
    id: "p-coconut-oil",
    name: "Coconut Oil",
    slug: "coconut-oil",
    description:
      "Unrefined, cold-pressed coconut oil that goes solid below room temperature and melts on contact with skin. A do-everything staple for cooking, hair, and skin routines alike.",
    status: "published",
    isPetSafe: true,
    petSafeNote: "A small, occasional spoonful is a common treat addition for dogs. Introduce gradually and check with your vet first if your pet has a sensitive stomach.",
    images: [{ src: "", alt: "Jar of solid white coconut oil with a wooden spoon", isPlaceholder: true }],
    variants: [
      variant("250g", 4200, 44, "SO-COC-250"),
      variant("500g", 7800, 25, "SO-COC-500"),
      variant("1kg", 14000, 13, "SO-COC-1000"),
    ],
    facets: tags(["oils", "african", "hair-care", "skin-care"]),
  },
  {
    id: "p-shea-butter",
    name: "Raw Shea Butter",
    slug: "raw-shea-butter",
    description:
      "Unrefined, ivory-toned shea butter, hand-whipped from shea nuts in the West African tradition it's named for. Rich and deeply moisturizing — scoop a small amount and warm it between your palms before applying.",
    status: "published",
    isPetSafe: true,
    petSafeNote: "Raw shea butter is a common ingredient in homemade paw-balm recipes. Apply a thin layer and monitor to make sure your pet doesn't lick it off immediately.",
    images: [{ src: "", alt: "Chunk of raw ivory shea butter in a wooden bowl", isPlaceholder: true }],
    variants: [
      variant("100g", 3000, 52, "SO-SHE-100"),
      variant("250g", 6500, 28, "SO-SHE-250"),
      variant("500g", 11500, 6, "SO-SHE-500"),
    ],
    facets: tags(["oils", "african", "skin-care", "hair-care", "joint-mobility-support"]),
  },
  {
    id: "p-frankincense-oil",
    name: "Frankincense Oil",
    slug: "frankincense-oil",
    description:
      "Steam-distilled frankincense oil from resin tapped in the Horn of Africa tradition. Warm, resinous, and grounding — a drop or two blended into a carrier oil is a longstanding pick for evening wind-down and post-movement massage routines.",
    status: "published",
    isPetSafe: false,
    images: [{ src: "", alt: "Amber dropper bottle of frankincense oil beside resin tears", isPlaceholder: true }],
    variants: [
      variant("30ml", 8500, 19, "SO-FRA-30"),
      variant("100ml", 22000, 4, "SO-FRA-100"),
    ],
    facets: tags(["oils", "african", "joint-mobility-support", "stress-sleep-support", "immune-support"]),
  },
];

export const SEED_PRODUCTS: Product[] = [...REAL_PRODUCTS, ...PLACEHOLDER_PRODUCTS];
