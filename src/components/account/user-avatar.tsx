import Image from "next/image";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
  teal: "bg-teal-500",
  fuchsia: "bg-fuchsia-500",
};

export const AVATAR_COLOR_KEYS = Object.keys(COLOR_MAP);

/** 8 hazır tilki avatarı — public/avatars/fox-1.webp … fox-8.webp. */
export const FOX_AVATAR_IDS = [1, 2, 3, 4, 5, 6, 7, 8];
export const foxAvatarSrc = (id: number) => `/avatars/fox-${id}.webp`;

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return (p.length >= 2 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase();
}

/** avatar_path: "url:..." → foto, "fox:N" → tilki, "color:key" → renk, null → hash renk. */
export function UserAvatar({
  name,
  avatarPath,
  size = 40,
  className,
}: {
  name: string;
  avatarPath?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarPath?.startsWith("url:")) {
    return (
      <span
        className={cn("relative inline-block overflow-hidden rounded-full", className)}
        style={{ width: size, height: size }}
      >
        <Image src={avatarPath.slice(4)} alt={name} fill className="object-cover" />
      </span>
    );
  }

  if (avatarPath?.startsWith("fox:")) {
    const id = Number(avatarPath.slice(4)) || 1;
    return (
      <span
        className={cn("relative inline-block overflow-hidden rounded-full", className)}
        style={{ width: size, height: size }}
      >
        <Image src={foxAvatarSrc(id)} alt={name} fill className="object-cover" />
      </span>
    );
  }

  const colorKey = avatarPath?.startsWith("color:")
    ? avatarPath.slice(6)
    : AVATAR_COLOR_KEYS[
        Math.abs(
          [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0),
        ) % AVATAR_COLOR_KEYS.length
      ];

  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full font-semibold text-white",
        COLOR_MAP[colorKey] ?? "bg-brand-500",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
