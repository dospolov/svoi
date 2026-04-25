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
