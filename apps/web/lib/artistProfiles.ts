type ArtistProfile = {
  slug: string;
  name: string;
  genres: string[];
  shortDescription: string;
  bio: string;
  featuredBio?: string;
  featuredNote?: string;
  location?: string;
  image: string;
  sampleTrack?: {
    title: string;
    audioUrl: string;
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeArtistSlug(value: string) {
  return slugify(value);
}

export const editorialArtistProfiles: ArtistProfile[] = [
  {
    slug: "tales-of-george",
    name: "Tales of George",
    genres: ["Alternative Rock", "Indie", "South Coast"],
    shortDescription: "Hook-led alternative rock formed in Bognor Regis.",
    bio: "After the idea was bounced around for a while, Tales of George officially formed in September 2009 in the sleepy seaside resort of Bognor Regis on the south coast. Long time friends Dan Simons and Terence Wing met bass player James Langridge through mutual friends, and after a trip to Bennicassim Festival in 2009 it was decided that the trio would set about writing their own songs and start gigging.",
    featuredBio:
      "After the idea was bounced around for a while, Tales of George officially formed in September 2009 in the sleepy seaside resort of Bognor Regis on the south coast. Long time friends Dan Simons and Terence Wing met bass player James Langridge through mutual friends, and after a trip to Bennicassim festival in 2009 it was decided that the trio would set about writing their own songs and start gigging.",
    featuredNote:
      "Deceptive carries the raw spark of alternative garage rock, driven by punchy guitars, tight rhythm work, and a confident groove that pushes the track forward from the outset. The guitars cut through with a sharp, wiry tone while the rhythm section locks into a steady pulse, giving the song a restless, late-night energy.\n\nWhat gives the track its edge is the balance between grit and momentum. The riffs are lean and rhythmic, keeping the arrangement tight and focused while allowing the vocal delivery to bring attitude and character to the forefront. As the track builds, there’s a clear anthem-like quality to the hook and groove — the kind of chorus that feels made to be shouted back in a packed room.\n\nChosen for Fully Open Radio for its garage-rock swagger, punchy guitar energy, and anthem-ready drive, Deceptive captures the spirit of modern alternative rock with a raw, direct approach that feels immediate and built for volume.",
    location: "Bognor Regis, UK",
    image: "/artists/tales-of-george.webp",
    sampleTrack: {
      title: "Deceptive",
      audioUrl: "/api/media/tracks/tales-of-george/deceptive.mp3"
    }
  },
  {
    slug: "mask-of-judas",
    name: "Mask of Judas",
    genres: ["Progressive Metal", "Technical Metal", "UK"],
    shortDescription: "Progressive metal with heavy melody and technical precision.",
    bio: "Mask of Judas are a progressive metal band from the UK featuring guitarist Sam Bell who is a respected columnist for Guitar Interactive Magazine, Licklibrary and Premier Guitar. Sam is joined by Reece Fullwood (Eumeria) another highly popular metal guitarist from the UK. This Guitar duo brings together a unique and fresh form of metal with melodic but heavy shredding harmony 8 string guitars and vast harmonically satisfying music that is woven together with the intricate drum work of Jof Walsh (Aliases) and the technical grooves of George Bell on bass. With singer Jo Challen’s powerful heavy vocals mixed in with melodious R&B influenced clean singing. This bands powerful mix of musicianship and taste is conjoined with truly unique song writing, style and lyrics. Mask of Judas have brought their fresh and exciting brand of technical metal to many stages such as Bloodstock and UK Tech Fest.",
    featuredBio:
      "Mask of Judas are a progressive metal band from the UK featuring guitarist Sam Bell who is a respected columnist for Guitar Interactive Magazine, Licklibrary and Premier Guitar. Sam is joined by Reece Fullwood (Eumeria) another highly popular metal guitarist from the UK. This Guitar duo brings together a unique and fresh form of metal with melodic but heavy shredding harmony 8 string guitars and vast harmonically satisfying music that is woven together with the intricate drum work of Jof Walsh (Aliases) and the technical grooves of George Bell on bass. With singer Jo Challen’s powerful heavy vocals mixed in with melodious R&B influenced clean singing. This bands powerful mix of musicianship and taste is conjoined with truly unique song writing, style and lyrics. Mask of Judas have brought their fresh and exciting brand of technical metal to many stages such as Bloodstock and UK Tech Fest.",
    featuredNote:
      "Forsaken opens with a powerful surge of modern metal intensity, combining tightly controlled rhythm work with a dense wall of guitar tone. The track quickly establishes a driving momentum, built around punchy drums and riff patterns that balance precision with raw aggression.\n\nWhat stands out is the interplay between heavy rhythmic passages and moments where the arrangement breathes slightly, allowing the dynamics to shift and reset before driving back into the core groove. This push-and-pull between tension and release gives the track a sense of forward movement rather than simply maintaining constant intensity.\n\nChosen for Fully Open Radio for its tight modern metal production and relentless rhythmic drive, Forsaken captures the energy of contemporary heavy music while keeping the focus on groove and impact.",
    location: "United Kingdom",
    image: "/artists/mask-of-judas.webp",
    sampleTrack: {
      title: "Forsaken",
      audioUrl: "/api/media/tracks/mask-of-judas/forsaken.mp3"
    }
  },
  {
    slug: "the-ship-heads",
    name: "The Ship Heads",
    genres: ["Pirate Punk", "Punk", "Hardcore"],
    shortDescription: "Self-described pirate punk from the south of England.",
    bio: "The Ship Heads are a four piece, self described pirate punk band from the south of England. Blending a love of 80s and 90s punk and hardcore, old school rock and roll and adding their own special blend of piratical anarchy to keep things interesting and unpredictable. The Ship Heads thrive in a live environment and their raucous shows are not to be missed, with previous gigs being described as listenable, a little bit too loud, something a bit unusual and on the brink of falling apart. The crew is Cap'n Marc Lionhart on vocals, Thom Le Cabinboy on guitar, Evie Enby on bass and Boatswain Nick Styx on drums.",
    featuredBio:
      "The Ship Heads are a four piece, self described \"pirate punk\" band from the south of England. Blending a love of 80s and 90s punk and hardcore, old school rock and roll and adding their own special blend of piratical anarchy to keep things interesting and unpredictable.\n\nThe Ship Heads thrive in a live environment and their raucous shows are not to be missed, with previous gigs being described as \"listenable\", \"a little bit too loud\", \"something a bit unusual\" and \"on the brink of falling apart\".\n\nThe Ship Heads crew:\nVocals - Cap'n Marc Lionhart\nGuitar - Thom Le Cabinboy\nBass - Evie Enby\nDrums - Boatswain Nick Styx",
    featuredNote:
      "Jolly Rogered crashes in with the rough-and-ready spirit of old-school punk, built around fast, driving guitars and a rhythm section that feels loose, loud, and full of attitude. The track embraces that classic DIY energy where the focus is on momentum and character rather than polish, giving the whole thing a raw edge that feels immediate and alive.\n\nThere’s also a clear streak of humour running through the track. The delivery and lyrical tone lean into a tongue-in-cheek pirate theme, giving the song a playful personality that sits somewhere between a pub singalong and a punk riot. That mix of cheeky storytelling and scrappy punk energy makes it hard not to grin while the track barrels forward.\n\nChosen for Fully Open Radio for its raw old-school punk spirit and irreverent humour, Jolly Rogered captures the fun side of punk — loud, fast, slightly chaotic, and clearly not taking itself too seriously.",
    location: "South of England",
    image: "/artists/the-ship-heads.webp",
    sampleTrack: {
      title: "Jolly Rogered",
      audioUrl: "/api/media/tracks/the-ship-heads/jolly-rogered.mp3"
    }
  },
  {
    slug: "ivan-hays",
    name: "Ivan Hays",
    genres: ["Beat Music", "Instrumental Hip Hop", "Chill"],
    shortDescription: "Chopped vocals and cool-headed rhythms from Chichester.",
    bio: "Chichester native who had been surrounded by music at a young age, thanks to those at Airtight Studios, and influenced by beatmakers overseas, Ivan Hays's blend of chilled rhythms and chopped vocals is nothing groundbreaking, but hits the spot like a cold drink on a hot day. Linking up with rapper Jay Squared on Blumagik to the smooth guitar stylings of Sam Bell, Ivan Hays knows how to set the mood.",
    featuredBio:
      "Chichester native who had been surrounded by music at a young age, thanks to those at Airtight Studios, and influenced by beatmakers overseas, Ivan Hays's blend of chilled rhythms and chopped vocals is nothing groundbreaking, but hits the stop like a cold drink on a hot day.\n\nLinking up with rapper Jay Squared on \"Blumagik\" to the smooth guitar stylings of Sam Bell,\n\nIvan Hays knows how to set the mood",
    featuredNote:
      "Goodnight unfolds with a calm, spacious atmosphere that gradually draws the listener into its mood. The track leans toward an ambient electronic style, built around gentle rhythmic movement and evolving textures that create a sense of depth without overwhelming the listener.\n\nRather than pushing for high energy, the arrangement focuses on tone and atmosphere, allowing subtle shifts in sound and melody to carry the track forward. This slow progression gives the piece a reflective quality, making it feel immersive and cinematic as it develops.\n\nChosen for Fully Open Radio for its atmospheric depth and late-night feel, Goodnight is the kind of track that works perfectly in moments where mood and space become the focus of the listening experience.",
    location: "Chichester, UK",
    image: "/artists/ivan-hays.webp",
    sampleTrack: {
      title: "Goodnight",
      audioUrl: "/api/media/tracks/ivan-hays/goodnight.mp3"
    }
  },
  {
    slug: "stone",
    name: "Stone!?",
    genres: ["Metal", "Rock", "Groove"],
    shortDescription: "Three-piece groove-heavy metal from the South of England.",
    bio: "Stone!? are a three piece metal band from the South of England, drawing on metal, rock and dance music to create a groove-driven sound. Their influences include Helmet, Faith No More, Prodigy, Karma to Burn, Kyuss, Prong and DJ Shadow. The lineup features Si on guitar and vocals, Marc on drums and vocals, and Chris on bass.",
    location: "South of England",
    image: "/artists/stone.webp",
    sampleTrack: {
      title: "Jack Issues",
      audioUrl: "/api/media/tracks/stone/warm-medium.mp3"
    }
  },
  {
    slug: "core-of-io",
    name: "Core of iO",
    genres: ["Heavy Rock", "Mathcore", "Progressive"],
    shortDescription: "Dynamic heavy rock with mathcore and tech-metal edges.",
    bio: "Against the tide of ultra low tunings and borderline double digit guitar strings, Core of iO deliver a unique brand of Heavy Rock that leans on elements of Mathcore, Progressive and Tech Metal. Grunge infused vocals, relentless drums, intricate guitar work and hyperactive bass fuses to form a sound that is dynamic, intelligent and dripping with hooks. Common influences and comparisons made include The Mars Volta, Fall of Troy and Sikth.",
    featuredBio:
      "Against the tide of ultra low tunings and borderline double digit guitar strings, Core of iO deliver a unique brand of Heavy Rock that leans on elements of Mathcore, Progressive and Tech Metal.\n\nGrunge infused vocals, relentless drums, intricate guitar work and hyperactive bass fuses to form a sound that is “dynamic, intelligent and dripping with hooks”. Common influences and comparisons made include The Mars Volta, Fall of Troy and Sikth.",
    featuredNote:
      "Done opens with a tight, controlled intensity that quickly settles into a powerful rhythmic framework. The track leans into heavy progressive rock and mathcore territory, built around shifting riff patterns and precise, locked-in instrumentation. Rather than relying purely on volume or distortion, the arrangement focuses on rhythm and structure, allowing the guitar work and dynamic shifts to drive the momentum.\n\nThroughout the track there’s a strong sense of controlled tension. Jagged riff changes and rhythmic breaks keep the listener slightly off balance while the core groove anchors the composition. This push and pull between complexity and groove gives the track a distinctive identity.\n\nChosen for Fully Open Radio because of its technical edge and rhythmic precision, Done captures the energy of modern progressive heavy music while maintaining a raw, live-band feel.",
    location: "United Kingdom",
    image: "/artists/core-of-io.webp",
    sampleTrack: {
      title: "Done",
      audioUrl: "/api/media/tracks/core-of-io/done.mp3"
    }
  },
  {
    slug: "ticklin-the-pickle",
    name: "Ticklin' The Pickle",
    genres: ["Funk", "Soul", "Live Groove"],
    shortDescription: "Fresh funk and soul with rare grooves and guest players.",
    bio: "Ticklin' The Pickle aka TTP give funk and soul a fresh and vibrant new edge. They combine their own exciting material seamlessly with innovative arrangements of rare funk and soul grooves. With a cast of five regulars, plus a handful of guest vocalists and brass sections, Ticklin the Pickle are a band with more funk than you’d typically expect to find in their home town of Chichester.",
    featuredBio:
      "Ticklin' The Pickle aka TTP give funk and soul a fresh and vibrant new edge. They combine their own exciting material seamlessly with innovative arrangements of rare funk and soul grooves.\n\nWith a cast of five regulars, plus a handful of guest vocalists and brass sections, Ticklin the Pickle are a band with more funk than you’d typically expect to find in their home town of Chichester.",
    featuredNote:
      "Give It slips into a groove that feels effortlessly cool, blending funk rhythm with jazzy flair and a relaxed confidence. The track carries the kind of laid-back swing that feels right at home in a dimly lit club, where the band locks into the groove and lets the music breathe.\n\nThere’s a smooth interplay between the rhythm and melodic elements, giving the track a sense of movement without ever feeling rushed. Instead, it settles into its pocket and rides the groove, creating a vibe that feels both stylish and slightly nostalgic.\n\nChosen for Fully Open Radio for its funk-driven groove and jazz-club atmosphere, Give It feels like the soundtrack to a smoke-filled room from another era — cool, confident, and effortlessly musical.",
    location: "Chichester, UK",
    image: "/artists/ticklin-the-pickle.webp",
    sampleTrack: {
      title: "Give It",
      audioUrl: "/api/media/tracks/ticklin-the-pickle/give-it.mp3"
    }
  },
  {
    slug: "noahs-house-band",
    name: "Noah's House Band",
    genres: ["Folk", "Family", "Quirky"],
    shortDescription: "Family-friendly folkesque storytelling from inside the ark.",
    bio: "From within the hull of Noah's Ark; comes Noah's House Band, a quirky series of family friendly folkesque tunes unlike anything ever heard before. Using vocal dexterity, honky instruments, household implements and the furthest reaches of imagination the cast of characters regale us with their enchanting tales including a hydrophobic whale and a Duckbill platypus with an identity crisis.",
    featuredBio:
      "From within the hull of Noah's Ark; comes Noah's House Band, a quirky series of family friendly folkesque tunes unlike anything ever heard before.\n\nUsing vocal dexterity, honky instruments, household implements and the furthest reaches of imagination the cast of characters regale us with their enchanting tales including a hydrophobic whale and a Duckbill platypus with an identity crisis.",
    featuredNote:
      "DODO stands out immediately with its quirky character and playful energy. Built around a rhythmic groove that hints at a sea-shanty feel, the track carries a slightly tongue-in-cheek charm while still maintaining a tight, driving structure. The rhythm and phrasing give it a communal, almost chant-like quality, as if it could just as easily be sung by a crew hauling ropes as it could sit within an experimental electronic or alternative setting.\n\nWhat makes the track memorable is its sense of humour. Rather than taking itself too seriously, DODO leans into its offbeat personality, using repetition, rhythm, and unusual tonal choices to create something both entertaining and distinctive.\n\nChosen for Fully Open Radio for its quirky spirit, nautical groove, and playful originality, DODO is a reminder that great music doesn’t always have to follow the expected path.",
    location: "United Kingdom",
    image: "/artists/noahs-house-band.webp",
    sampleTrack: {
      title: "DODO",
      audioUrl: "/api/media/tracks/noahs-house-band/dodo.mp3"
    }
  },
  {
    slug: "grzzly",
    name: "GRZZLY",
    genres: ["Experimental Hip Hop", "Underground", "Radio"],
    shortDescription: "Raw underground hip hop and damaged texture.",
    bio: "GRZZLY sits near the centre of the Fully Open sound: raw underground hip hop, damaged sonics and direct energy built for headphones, radio rotations and late-night listening sessions.",
    featuredNote:
      "Sonny Boy moves with a laid-back but deliberate rhythm, built around a hypnotic beat and spacious production that allows each element room to breathe. The track leans into experimental hip-hop territory, blending groove-driven percussion with textured layers that give the sound a slightly off-kilter, atmospheric feel.\n\nRather than rushing toward big hooks, the track unfolds steadily, letting the beat carry the momentum while subtle changes in tone and rhythm keep the arrangement evolving. That balance between restraint and movement gives Sonny Boy a distinctive character, sitting comfortably between experimental hip-hop and underground beat culture.\n\nChosen for Fully Open Radio for its head-nod groove and unconventional production style, the track captures the spirit of independent artists pushing hip-hop into new sonic spaces.",
    location: "United Kingdom",
    image: "/artists/grzzly.webp",
    sampleTrack: {
      title: "Sonny Boy",
      audioUrl: "/api/media/featured/grzzly-sonny-boy.mp3"
    }
  },
  {
    slug: "audio-kulture",
    name: "Audio Kulture",
    genres: ["Deep House", "Minimal", "Techno"],
    shortDescription: "South coast electronic culture shaped by years behind the decks.",
    bio: "I fell in love with Electronic Dance Music after frequenting White Sugar, Tonic, Beatroute and In-ter-Dance nights on the South Coast of England. I began DJing in 1993. Playing at Tonic at The Empire Club (Bognor Regis), Luxuria (Southampton), Gossips (Soho), Conch at J21 (Leicester) and the Escape Club (Brighton). I was lucky enough to play alongside some of the best DJs on the planet including Kevin Saunderson, John Acquaviva, Mr C, Evil Eddie Richards, Colin Dale, Terry Francis, Craig Richards, Nick Warren, Stacey Tough and Femi B. I enjoy all genres of music, if it's good I like it. When DJing or performing live, I play Deep, Minimal, House and Techno.",
    featuredBio:
      "I fell in love with Electronic Dance Music after frequenting White Sugar, Tonic, Beatroute and In-ter-Dance nights on the South Coast of England. I began DJing in 1993. Playing at 'Tonic' @ The Empire Club (Bognor Regis), 'Luxuria' (Southampton), 'Gossips' (Soho), 'Conch' @ J21 (Leicester) and the Escape Club (Brighton). I was lucky enough to play alongside some of the best DJs on the planet including Kevin Saunderson, John Acquaviva, Mr C, Evil Eddie Richards, Colin Dale, Terry Francis, Craig Richards, Nick Warren, Stacey Tough and Femi B.\n\nI enjoy all genres of music, if it's good I like it.\nWhen DJing or performing live, I play Deep, Minimal, House and Techno.",
    featuredNote:
      "Chosen for its steady mid-tempo pulse and layered atmosphere, Comfort Zone builds gradually into a hypnotic groove that rewards patient listening. The track sits around a 120 BPM rhythm, giving it a driving but unhurried momentum while allowing the textures and melodic elements to evolve naturally across its extended runtime.\n\nRather than relying on big drops or sudden changes, the arrangement unfolds in waves, with subtle shifts in tone and rhythm creating a sense of progression. The result is a track that feels immersive and expansive, drawing the listener into its groove while maintaining enough movement to keep the energy alive throughout.\n\nIts balance between rhythmic structure and evolving sonic layers makes it a natural fit for Fully Open Radio’s curated programming, where tracks that develop mood and atmosphere alongside strong musical identity stand out.",
    location: "South Coast, England",
    image: "/artists/audio-kulture.webp",
    sampleTrack: {
      title: "Comfort Zone",
      audioUrl: "/api/media/tracks/audio-kulture/comfort-zone.mp3"
    }
  },
  {
    slug: "black-gamma",
    name: "Black Gamma",
    genres: ["Alternative Rock", "Dub", "Latin"],
    shortDescription: "Chichester four-piece mixing Mexican rhythm, dub and rock.",
    bio: "A band of four from Chichester. Happily fusing the Latin rhythms of Mexico with dub, alternative rock and the odd bit of funk. Whatever it is, there are sure to be good vibes and lots of energy. Cobi (vocals & guitar), Sam (guitars), Onion (drums), Steve (bass).",
    featuredBio:
      "A band of four from Chichester. Happily fusing the Latin rhythms of Mexico with dub,\n\nalternative rock and the odd bit of funk. Whatever it is, there are sure to be good vibes and\n\nlots of energy.\n\nCobi (vocals & guitar)\nSam (guitars)\nOnion (drums)\nSteve (bass)",
    featuredNote:
      "Chosen for its driving rhythm and raw alternative energy, Falling Slowly blends fast-paced groove with textured layers that give the track both movement and atmosphere. Sitting around a high-energy tempo, the rhythm pushes forward with urgency while the surrounding sonic elements add depth and character.\n\nThe track balances momentum with mood, shifting between tight rhythmic passages and more open sections that allow the sound to breathe. That contrast gives the track a sense of progression rather than simply maintaining intensity throughout.\n\nWith its fusion of alternative rock attitude and rhythm-led structure, Falling Slowly stands out as a track that carries both impact and personality — exactly the kind of music that fits the open-minded programming of Fully Open Radio.",
    location: "Chichester, UK",
    image: "/artists/black-gamma.webp",
    sampleTrack: {
      title: "Falling Slowly",
      audioUrl: "/api/media/tracks/black-gamma/falling-slowly.mp3"
    }
  }
];

export const featuredArtistSlugs = [
  "audio-kulture",
  "black-gamma",
  "core-of-io",
  "grzzly",
  "ivan-hays",
  "mask-of-judas",
  "noahs-house-band",
  "stone",
  "tales-of-george",
  "the-ship-heads",
  "ticklin-the-pickle"
] as const;

const profileMap = new Map(
  editorialArtistProfiles.flatMap((artist) => [
    [artist.slug, artist],
    [slugify(artist.name), artist]
  ])
);

profileMap.set("stone", editorialArtistProfiles.find((artist) => artist.slug === "stone")!);
profileMap.set("stone-sq", editorialArtistProfiles.find((artist) => artist.slug === "stone")!);
profileMap.set("core-of-io", editorialArtistProfiles.find((artist) => artist.slug === "core-of-io")!);
profileMap.set("core-of-i-o", editorialArtistProfiles.find((artist) => artist.slug === "core-of-io")!);
profileMap.set("grzzly", editorialArtistProfiles.find((artist) => artist.slug === "grzzly")!);

export function getEditorialArtistProfile(slug: string) {
  return profileMap.get(slugify(slug));
}

export function mergeArtistRecord(artist: Record<string, unknown>) {
  const slug = String(artist.slug ?? "");
  const profile = getEditorialArtistProfile(slug);

  if (!profile) {
    return artist;
  }

  return {
    ...artist,
    slug: profile.slug,
    name: profile.name,
    bio: profile.bio,
    genres: profile.genres,
    shortDescription: profile.shortDescription,
    location: profile.location,
    image: profile.image,
    sampleTrack: profile.sampleTrack
  };
}

export function mergeArtistRecordWithLivePreference(artist: Record<string, unknown>) {
  const slug = String(artist.slug ?? "");
  const profile = getEditorialArtistProfile(slug);

  if (!profile) {
    return artist;
  }

  return {
    ...profile,
    ...artist,
    slug: String(artist.slug ?? profile.slug),
    name: String(artist.name ?? profile.name),
    bio: typeof artist.bio === "string" && artist.bio.length > 0 ? artist.bio : profile.bio,
    genres: Array.isArray(artist.genres) && artist.genres.length ? artist.genres : profile.genres,
    shortDescription:
      typeof artist.shortDescription === "string" && artist.shortDescription.length > 0
        ? artist.shortDescription
        : profile.shortDescription,
    location:
      typeof artist.location === "string" && artist.location.length > 0 ? artist.location : profile.location,
    image:
      (typeof artist.profileImage === "string" && artist.profileImage) ||
      (typeof artist.bannerImage === "string" && artist.bannerImage) ||
      (typeof artist.heroImage === "string" && artist.heroImage) ||
      (typeof artist.image === "string" && artist.image) ||
      profile.image,
    sampleTrack:
      artist.sampleTrack && typeof artist.sampleTrack === "object" ? artist.sampleTrack : profile.sampleTrack
  };
}

export function mergeArtistRecordForFeaturedPage(artist: Record<string, unknown>) {
  const slug = String(artist.slug ?? "");
  const profile = getEditorialArtistProfile(slug);

  if (!profile) {
    return artist;
  }

  return {
    ...profile,
    ...artist,
    slug: String(artist.slug ?? profile.slug),
    name: String(artist.name ?? profile.name),
    bio: profile.featuredBio ?? profile.bio,
    featuredNote: profile.featuredNote,
    genres: Array.isArray(artist.genres) && artist.genres.length ? artist.genres : profile.genres,
    shortDescription: profile.shortDescription,
    location:
      typeof artist.location === "string" && artist.location.length > 0 ? artist.location : profile.location,
    image:
      (typeof artist.profileImage === "string" && artist.profileImage) ||
      (typeof artist.bannerImage === "string" && artist.bannerImage) ||
      (typeof artist.heroImage === "string" && artist.heroImage) ||
      (typeof artist.image === "string" && artist.image) ||
      profile.image,
    sampleTrack:
      artist.sampleTrack && typeof artist.sampleTrack === "object" ? artist.sampleTrack : profile.sampleTrack
  };
}

export function buildFeaturedArtistList(artists: Array<Record<string, unknown>>) {
  const mergedBySlug = new Map<string, Record<string, unknown>>();

  for (const artist of artists) {
    const rawSlug = String(artist.slug ?? "");
    const normalizedSlug = normalizeArtistSlug(rawSlug);
    const editorialProfile = getEditorialArtistProfile(normalizedSlug);
    const canonicalSlug = editorialProfile?.slug ?? normalizedSlug;

    if (!featuredArtistSlugs.includes(canonicalSlug as (typeof featuredArtistSlugs)[number])) {
      continue;
    }

    mergedBySlug.set(canonicalSlug, mergeArtistRecordWithLivePreference(artist));
  }

  return featuredArtistSlugs.map((slug) => {
    const liveArtist = mergedBySlug.get(slug);

    if (liveArtist) {
      return liveArtist;
    }

    return buildArtistFallback(slug)!;
  });
}

export function mergeArtistList(artists: Array<Record<string, unknown>>) {
  const merged = artists.map((artist) => mergeArtistRecord(artist));
  const seen = new Set(merged.map((artist) => String(artist.slug ?? "")));

  for (const profile of editorialArtistProfiles) {
    if (seen.has(profile.slug)) {
      continue;
    }

    merged.push({
      id: profile.slug,
      slug: profile.slug,
      name: profile.name,
      bio: profile.bio,
      genres: profile.genres,
      shortDescription: profile.shortDescription,
      location: profile.location,
      image: profile.image,
      sampleTrack: profile.sampleTrack
    });
  }

  return merged.sort((left, right) => {
    const leftProfile = getEditorialArtistProfile(String(left.slug ?? ""));
    const rightProfile = getEditorialArtistProfile(String(right.slug ?? ""));

    if (leftProfile && !rightProfile) {
      return -1;
    }

    if (!leftProfile && rightProfile) {
      return 1;
    }

    return String(left.name ?? "").localeCompare(String(right.name ?? ""));
  });
}

export function buildArtistFallback(slug: string) {
  const profile = getEditorialArtistProfile(slug);

  if (!profile) {
    return null;
  }

  return {
    id: profile.slug,
    slug: profile.slug,
    name: profile.name,
    bio: profile.bio,
    genres: profile.genres,
    shortDescription: profile.shortDescription,
    location: profile.location,
    image: profile.image,
    embeddedPlayer: "",
    sampleTrack: profile.sampleTrack
  };
}
