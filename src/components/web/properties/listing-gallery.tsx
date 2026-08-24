"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export type GalleryImage = { url: string; alt: string };

/**
 * The listing gallery and its lightbox.
 *
 * Desktop is a 2x2 mosaic with the primary image taking a double square;
 * mobile is a swipeable strip with a counter. Both open the same lightbox.
 *
 * The lightbox contract, from doc 03 §3.4, is the part that is usually got
 * wrong: focus is trapped inside it, Escape closes, arrow keys move between
 * photographs, and focus returns to the thumbnail that opened it. A lightbox
 * that dumps focus back at the top of the document has lost a keyboard user
 * their place on a page that is mostly photographs.
 *
 * Alt text comes from the media record. Where a record has none the service
 * synthesises "{title}, photo n of N" rather than shipping an empty alt,
 * which a screen reader reads out as the file name.
 */
export function ListingGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const CloseIcon = webIcons.close;
  const PrevIcon = webIcons.chevronLeft;
  const NextIcon = webIcons.chevronRight;

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return null;
        // Wraps, because arrowing off the last photo and getting nothing reads
        // as a broken control rather than as an edge.
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length]
  );

  // Shared lock: preserves scroll position on iOS and compensates for the
  // scrollbar on desktop, neither of which the bare overflow toggle did.
  useBodyScrollLock(openIndex !== null);

  useEffect(() => {
    if (openIndex === null) return;

    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, step]);

  const open = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setOpenIndex(index);
  };

  // No photographs at all. The branded panel is the designed answer, and it is
  // an acceptable outcome rather than a gap to paper over with stock imagery.
  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-web-panel bg-surface-2">
        <span aria-hidden="true" className="web-title-light text-8xl text-brand-dark/20">
          S
        </span>
        <span className="sr-only">No photographs available for {title} yet</span>
      </div>
    );
  }

  const mosaic = images.slice(0, 5);
  const remaining = images.length - mosaic.length;

  return (
    <>
      <div className="grid gap-2 overflow-hidden rounded-web-panel sm:grid-cols-4 sm:grid-rows-2">
        {mosaic.map((image, index) => {
          const isPrimary = index === 0;
          const isLastTile = index === mosaic.length - 1;

          return (
            <button
              key={image.url}
              type="button"
              onClick={(event) => open(index, event)}
              className={cn(
                "group relative block overflow-hidden bg-brand-dark",
                isPrimary
                  ? "aspect-[16/11] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
                  : "hidden aspect-[4/3] sm:block"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes={isPrimary ? "(min-width: 640px) 50vw, 100vw" : "25vw"}
                priority={isPrimary}
                className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {isLastTile && remaining > 0 && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-brand-dark/72">
                  <span className="web-numeric text-2xl text-on-dark-hi">+{remaining}</span>
                  <span className="web-control text-[12.5px] uppercase tracking-[0.1em] text-on-dark">
                    View all {images.length}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile counter and an explicit way in, since the mosaic collapses to
          one tile and the "+N" affordance disappears with it. */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => open(0, event)}
          className="web-control web-hit mt-3 inline-flex rounded-web-full border border-dark-line px-4 py-2 text-[11.5px] uppercase tracking-[0.12em] text-on-dark-hi sm:hidden"
        >
          View all {images.length} photos
        </button>
      )}

      {openIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, photo ${openIndex + 1} of ${images.length}`}
          tabIndex={-1}
          className="fixed inset-0 z-overlay flex flex-col bg-brand-dark/96 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between p-4">
            <p className="web-numeric inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-on-dark-hi backdrop-blur-sm">
              {openIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="web-hit inline-flex size-14 items-center justify-center rounded-web-full text-on-dark-hi transition-all hover:scale-105 hover:bg-dark-raise"
            >
              <CloseIcon size={24} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={images[openIndex].url}
              alt={images[openIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-4 p-6">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="web-hit inline-flex size-14 items-center justify-center rounded-web-full border border-dark-line text-on-dark-hi transition-all hover:scale-105 hover:bg-dark-raise"
            >
              <PrevIcon size={24} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="web-hit inline-flex size-14 items-center justify-center rounded-web-full border border-dark-line text-on-dark-hi transition-all hover:scale-105 hover:bg-dark-raise"
            >
              <NextIcon size={24} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
