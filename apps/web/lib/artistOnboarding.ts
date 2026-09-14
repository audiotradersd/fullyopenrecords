export type OnboardingFeature = {
  id: "upload" | "bulk-upload" | "releases" | "video" | "versions" | "gigs";
  title: string;
  description: string;
  actionLabel: string;
  dashboardHref: string;
  steps: string[];
};

export const artistOnboardingFeatures: OnboardingFeature[] = [
  {
    id: "upload",
    title: "Upload a track",
    description: "Share a single track and get it on your artist page in minutes.",
    actionLabel: "Upload a track",
    dashboardHref: "/artist/dashboard#tracks",
    steps: ["Open Tracks in Artist Dashboard.", "Choose Add Track and upload your audio file.", "Add its title, artwork and optional album, then create it."]
  },
  {
    id: "bulk-upload",
    title: "Bulk upload",
    description: "Add multiple tracks at once — perfect for EPs, albums or your back catalogue.",
    actionLabel: "Upload tracks",
    dashboardHref: "/artist/dashboard#tracks",
    steps: ["Open Tracks and choose Bulk Upload.", "Select all the audio files you want to add.", "Use clear filenames such as 01 - Track Title.mp3, then organise them in Track Library."]
  },
  {
    id: "releases",
    title: "Create a release",
    description: "Turn your tracks into an EP or album with artwork, tracklist and more.",
    actionLabel: "Create a release",
    dashboardHref: "/artist/dashboard#albums",
    steps: ["Open Albums and choose Create Album.", "Add your title, release details, description and artwork.", "Go to Tracks, select the uploaded songs, then add them to your album."]
  },
  {
    id: "video",
    title: "Add a video",
    description: "Share live sessions, music videos or behind-the-scenes footage.",
    actionLabel: "Add a video",
    dashboardHref: "/artist/dashboard#media",
    steps: ["Open Media in Artist Dashboard.", "Add a video title and its link.", "Add a thumbnail if you have one, then save it to your page."]
  },
  {
    id: "versions",
    title: "Track versions",
    description: "Show the journey — demos, rehearsals, alternate mixes and more.",
    actionLabel: "Add versions",
    dashboardHref: "/artist/dashboard#tracks",
    steps: ["Open Tracks and find the song you want to document.", "Choose Add Version.", "Upload the version and add notes or setup photos to capture the story behind it."]
  },
  {
    id: "gigs",
    title: "Add gigs",
    description: "Tell fans where you're playing live and keep your dates up to date.",
    actionLabel: "Add a gig",
    dashboardHref: "/artist/dashboard#gigs",
    steps: ["Open Gigs in Artist Dashboard.", "Add the date, venue, city and event details.", "Include a ticket link so listeners can go straight to the show."]
  }
];

export const artistHelpLinks = [
  ["Uploading music", "#upload"],
  ["Creating a release", "#releases"],
  ["Adding videos", "#video"],
  ["Track versions", "#versions"],
  ["Adding gigs", "#gigs"],
  ["Your artist profile", "/artist/dashboard#profile"],
  ["Get Heard & Radio", "/get-heard"]
] as const;
