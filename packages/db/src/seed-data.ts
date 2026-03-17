export const seedArtists = [
  {
    name: "Cinder Static",
    slug: "cinder-static",
    bio: "Experimental electronics and late-night drum programming from South London.",
    heroImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
    galleryImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
    ],
    socialLinks: {
      instagram: "https://instagram.com/fullyopenrecords",
      bandcamp: "https://bandcamp.com"
    },
    embeddedPlayer: "<iframe src='https://bandcamp.com/EmbeddedPlayer/'></iframe>",
    genres: ["Electronic", "Ambient"],
    featured: true
  }
];

export const seedReleases = [
  {
    title: "Night Index",
    artistId: 1,
    type: "EP",
    artwork: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    releaseDate: "2025-11-14",
    streamingLinks: {
      spotify: "https://spotify.com",
      apple: "https://music.apple.com"
    },
    description: "A four-track EP built for pirate radio transitions."
  }
];

export const seedProducts = [
  {
    title: "Night Index Vinyl",
    slug: "night-index-vinyl",
    description: "180g limited pressing with risograph sleeve.",
    price: 2800,
    currency: "GBP",
    category: "vinyl",
    images: ["https://images.unsplash.com/photo-1511379938547-c1f69419868d"],
    variants: [
      { name: "Format", value: "Black", inventory: 25 },
      { name: "Format", value: "Smoked", inventory: 12 }
    ],
    inventory: 37,
    stripePriceId: "price_demo_vinyl",
    featured: true
  }
];

export const seedFaqs = [
  {
    question: "Do you accept demos?",
    answer: "Yes. Use the submission form and include one private stream link.",
    order: 1
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes. Shipping rates are calculated at Stripe Checkout.",
    order: 2
  }
];

export const seedPages = [
  {
    title: "Home",
    slug: "home",
    seoTitle: "Fully Open Records",
    seoDescription: "Independent label, radio station, and merch store.",
    published: true,
    blocks: [
      {
        type: "hero",
        data: {
          eyebrow: "Independent Label",
          title: "Fully Open Records",
          body: "Music, radio, and carefully made physical editions.",
          ctaLabel: "Explore artists",
          ctaHref: "/artists"
        }
      },
      { type: "artist_grid", data: { title: "Featured artists" } },
      { type: "radio_player", data: { title: "Live radio" } },
      { type: "product_grid", data: { title: "Latest merch" } },
      { type: "newsletter", data: { title: "Newsletter" } }
    ]
  },
  {
    title: "About",
    slug: "about",
    seoTitle: "About Fully Open Records",
    seoDescription: "About the label and radio ethos.",
    published: true,
    blocks: [
      {
        type: "text",
        data: {
          title: "About",
          body: "Fully Open Records is a platform for artists who like edges left visible."
        }
      }
    ]
  }
];

