import { cn } from "@/lib/utils/cn";
import { webIcons, type WebIconName } from "../icons";

/**
 * Background artwork for a dark band.
 *
 * The section 08 rule, verbatim: one glyph per dark band, 400 to 620px,
 * stroke 0.4, opacity 5 to 6%, bled off two edges, never on a light band.
 *
 * It exists because the photo library cannot carry these bands. A phone
 * photograph of a let apartment behind a headline produces a worse page than
 * no photograph, so the dark bands get texture from the icon set instead,
 * which costs nothing to load and cannot be badly exposed.
 */
export function BandArtwork({
  icon,
  position = "right",
  className,
}: {
  icon: WebIconName;
  /** Which pair of edges the glyph bleeds off. */
  position?: "right" | "left";
  className?: string;
}) {
  const IconComponent = webIcons[icon];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -bottom-[15%] hidden select-none opacity-[0.055] md:block",
        position === "right" ? "-right-[8%]" : "-left-[8%]",
        className
      )}
    >
      <IconComponent size={560} stroke={0.4} className="text-on-dark-hi" />
    </div>
  );
}
