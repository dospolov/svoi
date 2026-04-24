import type { Attendee } from "@/lib/events";

export function AvatarStack({ attendees, size = 24 }: { attendees: Attendee[]; size?: number }) {
  return (
    <div className="flex -space-x-2">
      {attendees.map((a, i) => (
        <div
          key={`${a.initials}-${i}`}
          className={`flex items-center justify-center rounded-full ring-2 ring-background ${a.color}`}
          style={{ width: size, height: size }}
        >
          <span
            className="font-mono font-medium text-[10px] text-black/80"
            style={{ fontSize: Math.max(9, size * 0.4) }}
          >
            {a.initials}
          </span>
        </div>
      ))}
    </div>
  );
}
