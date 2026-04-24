export type EventCategory = "active" | "craft" | "food" | "quiet" | "music";

export type EventGradient = "green" | "pink" | "orange" | "blue";

export type Attendee = {
  initials: string;
  color: string; // tailwind bg utility
};

export type EventItem = {
  id: string;
  index: string; // "01", "02"
  day: string; // "SAT"
  date: string; // "APR 26"
  time: string;
  category: EventCategory;
  title: string;
  neighborhood: string;
  host: string;
  gradient: EventGradient;
  attendees: Attendee[];
  going: string; // "47/60"
  price: string; // "FREE" or "$18"
  distance: string; // "0.8 MI"
  description: string;
};

export const events: EventItem[] = [
  {
    id: "sunrise-run-club",
    index: "01",
    day: "SAT",
    date: "APR 26",
    time: "6:30 AM",
    category: "active",
    title: "Sunrise Run Club",
    neighborhood: "Brooklyn",
    host: "East Side Movement",
    gradient: "green",
    attendees: [
      { initials: "M", color: "bg-accent-orange" },
      { initials: "J", color: "bg-accent-orange" },
      { initials: "R", color: "bg-accent-pink" },
      { initials: "SA", color: "bg-accent-green" },
    ],
    going: "47/60",
    price: "FREE",
    distance: "0.8 MI",
    description:
      "Meet at the park trail for an easy 5k along the waterfront. Coffee and pastries after. All paces welcome — no one runs alone.",
  },
  {
    id: "backyard-pottery-jam",
    index: "02",
    day: "SUN",
    date: "APR 27",
    time: "2:00 PM",
    category: "craft",
    title: "Backyard Pottery Jam",
    neighborhood: "Williamsburg",
    host: "Nina & the Clay Room",
    gradient: "pink",
    attendees: [
      { initials: "C", color: "bg-accent-blue" },
      { initials: "EF", color: "bg-accent-pink" },
    ],
    going: "12/16",
    price: "$18",
    distance: "1.4 MI",
    description:
      "Hand-build a small vase or bowl in a sunny backyard studio. Clay, tools, and firing all included. Beginners absolutely welcome.",
  },
  {
    id: "tuesday-dinner-long-table",
    index: "03",
    day: "TUE",
    date: "APR 29",
    time: "7:30 PM",
    category: "food",
    title: "Tuesday Dinner, Long Table",
    neighborhood: "Lower East Side",
    host: "The Supper Circle",
    gradient: "orange",
    attendees: [
      { initials: "F", color: "bg-accent-green" },
      { initials: "R", color: "bg-accent-blue" },
      { initials: "TS", color: "bg-accent-orange" },
    ],
    going: "22/24",
    price: "$34",
    distance: "2.1 MI",
    description:
      "A seasonal three-course meal served family style at one long table. Bring an appetite and meet your neighbors.",
  },
  {
    id: "book-swap-slow-reading",
    index: "04",
    day: "WED",
    date: "APR 30",
    time: "6:00 PM",
    category: "quiet",
    title: "Book Swap & Slow Reading",
    neighborhood: "Fort Greene",
    host: "Margins Reading Room",
    gradient: "blue",
    attendees: [
      { initials: "L", color: "bg-accent-pink" },
      { initials: "AK", color: "bg-accent-blue" },
    ],
    going: "9/20",
    price: "FREE",
    distance: "3.0 MI",
    description:
      "Bring a book you love, leave with one you don't know. Then we read together in comfortable silence for an hour.",
  },
];

export const categoryColor: Record<EventCategory, string> = {
  active: "text-accent-lime",
  craft: "text-accent-pink",
  food: "text-accent-orange",
  quiet: "text-accent-blue",
  music: "text-accent-green",
};

export const gradientClass: Record<EventGradient, string> = {
  green: "bg-grad-green",
  pink: "bg-grad-pink",
  orange: "bg-grad-orange",
  blue: "bg-grad-blue",
};

export function getEvent(id: string): EventItem | undefined {
  return events.find((e) => e.id === id);
}
