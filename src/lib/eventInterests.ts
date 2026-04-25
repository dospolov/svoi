export type EventInterestItem = {
  id: string
  label: string
}

export type EventInterestGroup = {
  heading: string
  items: EventInterestItem[]
}

export const EVENT_INTEREST_GROUPS: EventInterestGroup[] = [
  {
    heading: "IT & Tech",
    items: [
      { id: "it-software", label: "IT & Software" },
      { id: "frontend-development", label: "Frontend Development" },
      { id: "backend-development", label: "Backend Development" },
      { id: "ai-machine-learning", label: "AI & Machine Learning" },
      { id: "crypto-web3", label: "Crypto & Web3" },
      { id: "ui-ux-design", label: "UI/UX Design" },
      { id: "tech-meetups", label: "Tech Meetups" },
      { id: "open-source", label: "Open Source" },
      { id: "mobile-development", label: "Mobile Development" },
      { id: "cybersecurity", label: "Cybersecurity" },
      { id: "data-science", label: "Data Science" },
      { id: "networking-professional", label: "Networking (Professional)" },
      { id: "startups-entrepreneurship", label: "Startups & Entrepreneurship" },
      { id: "product-management", label: "Product Management" },
      { id: "game-dev", label: "Game Dev" },
    ],
  },
  {
    heading: "Languages & Education",
    items: [
      { id: "english-speaking-club", label: "English Speaking Club" },
      { id: "language-exchange", label: "Language Exchange" },
      { id: "english-for-it", label: "English for IT" },
      { id: "polish-for-expats", label: "Polish for Expats" },
      { id: "spanish-vibes", label: "Spanish Vibes" },
      { id: "german-practice", label: "German Practice" },
      { id: "french-conversations", label: "French Conversations" },
      { id: "public-speaking", label: "Public Speaking" },
      { id: "vocabulary-boost", label: "Vocabulary Boost" },
      { id: "personal-growth", label: "Personal Growth" },
      { id: "book-club", label: "Book Club" },
      { id: "workshops", label: "Workshops" },
      { id: "self-development", label: "Self-Development" },
      { id: "mentoring", label: "Mentoring" },
      { id: "history-culture", label: "History & Culture" },
    ],
  },
  {
    heading: "Active Life & Sports",
    items: [
      { id: "padel", label: "Padel" },
      { id: "tennis", label: "Tennis" },
      { id: "ping-pong-table-tennis", label: "Ping Pong (Table Tennis)" },
      { id: "football-soccer", label: "Football / Soccer" },
      { id: "basketball", label: "Basketball" },
      { id: "yoga-in-the-park", label: "Yoga in the Park" },
      { id: "bouldering-climbing", label: "Bouldering & Climbing" },
      { id: "cycling", label: "Cycling" },
      { id: "running-community", label: "Running Community" },
      { id: "gym-buddies", label: "Gym Buddies" },
      { id: "hiking", label: "Hiking" },
      { id: "volleyball", label: "Volleyball" },
      { id: "badminton", label: "Badminton" },
      { id: "dancing-bachata-salsa", label: "Dancing (Bachata/Salsa)" },
      { id: "rollerblading", label: "Rollerblading" },
    ],
  },
  {
    heading: "Social & Nightlife",
    items: [
      { id: "bar-hopping", label: "Bar Hopping" },
      { id: "craft-beer-tasting", label: "Craft Beer Tasting" },
      { id: "wine-lovers", label: "Wine Lovers" },
      { id: "nightlife-clubbing", label: "Nightlife & Clubbing" },
      { id: "rooftop-parties", label: "Rooftop Parties" },
      { id: "speakeasy-bars", label: "Speakeasy Bars" },
      { id: "live-music", label: "Live Music" },
      { id: "karaoke-night", label: "Karaoke Night" },
      { id: "pub-quiz", label: "Pub Quiz" },
      { id: "electronic-music-techno", label: "Electronic Music / Techno" },
    ],
  },
  {
    heading: "Culture & Entertainment",
    items: [
      { id: "theater-drama", label: "Theater & Drama" },
      { id: "cinema-movies", label: "Cinema & Movies" },
      { id: "modern-art", label: "Modern Art" },
      { id: "photography", label: "Photography" },
      { id: "stand-up-comedy", label: "Stand-up Comedy" },
      { id: "board-games", label: "Board Games" },
      { id: "chess", label: "Chess" },
      { id: "video-games-esports", label: "Video Games / E-sports" },
      { id: "museums-galleries", label: "Museums & Galleries" },
      { id: "creative-writing", label: "Creative Writing" },
    ],
  },
  {
    heading: "Lifestyle & Leisure",
    items: [
      { id: "picnic", label: "Picnic" },
      { id: "bbq-grilling", label: "BBQ / Grilling" },
      { id: "coffee-lovers", label: "Coffee Lovers" },
      { id: "foodies-gastronomy", label: "Foodies & Gastronomy" },
      { id: "vegan-vegetarian", label: "Vegan & Vegetarian" },
      { id: "cooking-class", label: "Cooking Class" },
      { id: "dog-walking", label: "Dog Walking" },
      { id: "traveling", label: "Traveling" },
      { id: "weekend-getaways", label: "Weekend Getaways" },
      { id: "meditation-mindfulness", label: "Meditation & Mindfulness" },
      { id: "volunteering", label: "Volunteering" },
      { id: "sustainable-living", label: "Sustainable Living" },
      { id: "vintage-thrift-shopping", label: "Vintage & Thrift Shopping" },
      { id: "urban-exploration", label: "Urban Exploration" },
      { id: "chill-chat", label: "Chill & Chat" },
    ],
  },
]

export const ALL_EVENT_INTERESTS: EventInterestItem[] =
  EVENT_INTEREST_GROUPS.flatMap((g) => g.items)

const INTEREST_BY_ID = new Map(ALL_EVENT_INTERESTS.map((i) => [i.id, i]))

export function getInterestLabelById(id: string): string | undefined {
  return INTEREST_BY_ID.get(id)?.label
}

function categoryContext(category: string): string {
  switch (category) {
    case "active":
      return "running run hike trail park sport yoga gym workout fitness volleyball tennis padel football soccer dance climb cycling walk"
    case "craft":
      return "pottery clay workshop craft hand-build studio art creative maker diy ceramic"
    case "food":
      return "dinner meal supper table seasonal course restaurant food coffee brunch tasting cooking kitchen gastronomy wine beer"
    case "quiet":
      return "book reading swap silence margins library study slow quiet chill meditation"
    case "music":
      return "music live dj band concert vinyl acoustic night sound karaoke techno"
    default:
      return category
  }
}

/** Match interest labels against title, description, and broad category hints. */
function interestMatchesHaystack(label: string, haystack: string): boolean {
  const lower = label.toLowerCase()
  const simplified = lower
    .replace(/[^\p{L}\p{N}\s/&().-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (simplified.length >= 3 && haystack.includes(simplified)) {
    return true
  }

  const segments = simplified
    .split(/[/]| - | \(|\)|,|&/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  for (const seg of segments) {
    if (seg.length >= 2 && haystack.includes(seg)) {
      return true
    }
  }

  const words = simplified.split(/\s+/).filter(Boolean)
  for (const w of words) {
    if (w.length >= 3 && haystack.includes(w)) {
      return true
    }
    if (
      (w === "it" || w === "ai" || w === "ux" || w === "ml") &&
      haystack.includes(w)
    ) {
      return true
    }
  }

  return false
}

function buildInterestHaystack(event: {
  title?: string
  description?: string
  category?: string
}): string {
  const base = `${event.title ?? ""} ${event.description ?? ""}`.toLowerCase()
  return `${base} ${categoryContext(event.category ?? "")}`
}

export function getPrimaryEventInterestLabel(event: {
  title?: string
  description?: string
  category?: string
  interestIds?: string[]
}): string | undefined {
  if (event.interestIds?.length) {
    for (const id of event.interestIds) {
      const label = getInterestLabelById(id)
      if (label) {
        return label
      }
    }
  }

  const haystack = buildInterestHaystack(event)
  const first = ALL_EVENT_INTERESTS.find((item) =>
    interestMatchesHaystack(item.label, haystack),
  )
  return first?.label
}

export function eventMatchesSelectedInterests(
  event: {
    title?: string
    description?: string
    category?: string
    interestIds?: string[]
  },
  selectedIds: string[],
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  if (event.interestIds?.length) {
    const interestSet = new Set(event.interestIds)
    if (selectedIds.some((id) => interestSet.has(id))) {
      return true
    }
  }

  const haystack = buildInterestHaystack(event)

  return selectedIds.some((id) => {
    const item = INTEREST_BY_ID.get(id)
    if (!item) {
      return false
    }
    return interestMatchesHaystack(item.label, haystack)
  })
}
