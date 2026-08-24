"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export type GalleryImage = { url: string; alt: string };

/**
 * Adaptive Master Listing Gallery.
 *
 * Designed for cinematic hero presentation:
 * - Renders the secondary/complementary images in an adaptive, gap-free grid.
 * - Portals the lightbox to document.body so it is never trapped by parent container transforms/filters.
 * - Full-viewport overlay with floating controls, keyboard trap, and thumbnail carousel.
 */
export function ListingGallery({
  allImages,
  displayImages,
  title,
  offsetIndex = 0,
}: {
  allImages: GalleryImage[];
  displayImages?: GalleryImage[];
  title: string;
  offsetIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const imagesToDisplay = displayImages ?? (allImages.length > 1 ? allImages.slice(1) : allImages);
  const actualOffset = displayImages ? offsetIndex : allImages.length > 1 ? 1 : 0;

  const CloseIcon = webIcons.close;
  const PrevIcon = webIcons.chevronLeft;
  const NextIcon = webIcons.chevronRight;
  const GridIcon = webIcons.grid;

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return null;
        return (current + delta + allImages.length) % allImages.length;
      });
    },
    [allImages.length]
  );

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

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-web-panel border border-dark-line bg-surface-2/10">
        <span aria-hidden="true" className="web-title-light text-8xl text-on-dark-lo/20">
          S
        </span>
        <span className="sr-only">No photographs available for {title} yet</span>
      </div>
    );
  }

  const count = imagesToDisplay.length;

  return (
    <div className="relative rounded-web-panel overflow-hidden border border-white/10 bg-brand-dark/40 backdrop-blur-md p-2 sm:p-2.5 shadow-2xl">
      {/* ── 1 Image Layout ── */}
      {count === 1 && (
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden rounded-web-card bg-brand-dark">
          <button
            type="button"
            onClick={(event) => open(actualOffset, event)}
            className="group relative block size-full"
          >
            <Image
              src={imagesToDisplay[0].url}
              alt={imagesToDisplay[0].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </button>
        </div>
      )}

      {/* ── 2 Images Layout: 2 Equal Balanced Columns ── */}
      {count === 2 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 h-[340px] sm:h-[440px] lg:h-[480px] overflow-hidden rounded-web-card bg-brand-dark">
          {imagesToDisplay.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={(event) => open(actualOffset + index, event)}
              className="group relative block size-full overflow-hidden bg-brand-dark"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── 3 Images Layout: 1 Hero (2 cols, 2 rows) + 2 Stacked (1 col) ── */}
      {count === 3 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:grid-rows-2 h-[360px] sm:h-[460px] lg:h-[500px] overflow-hidden rounded-web-card bg-brand-dark">
          <button
            type="button"
            onClick={(event) => open(actualOffset, event)}
            className="group relative block size-full overflow-hidden bg-brand-dark sm:col-span-2 sm:row-span-2"
          >
            <Image
              src={imagesToDisplay[0].url}
              alt={imagesToDisplay[0].alt}
              fill
              priority
              sizes="(min-width: 640px) 66vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </button>
          {imagesToDisplay.slice(1, 3).map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={(event) => open(actualOffset + index + 1, event)}
              className="group relative hidden sm:block size-full overflow-hidden bg-brand-dark sm:col-span-1 sm:row-span-1"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── 4 Images Layout: 2x2 Balanced Quadrant ── */}
      {count === 4 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2 h-[360px] sm:h-[460px] lg:h-[500px] overflow-hidden rounded-web-card bg-brand-dark">
          {imagesToDisplay.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={(event) => open(actualOffset + index, event)}
              className="group relative block size-full overflow-hidden bg-brand-dark"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── 5+ Images Layout: 1 Hero + 4 Quadrant Tiles with +N Badge ── */}
      {count >= 5 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2 h-[360px] sm:h-[460px] lg:h-[500px] overflow-hidden rounded-web-card bg-brand-dark">
          {imagesToDisplay.slice(0, 5).map((image, index) => {
            const isPrimary = index === 0;
            const isFifth = index === 4;
            const remaining = count - 5;

            return (
              <button
                key={image.url}
                type="button"
                onClick={(event) => open(actualOffset + index, event)}
                className={cn(
                  "group relative block size-full overflow-hidden bg-brand-dark",
                  isPrimary
                    ? "sm:col-span-2 sm:row-span-2"
                    : "hidden sm:block sm:col-span-1 sm:row-span-1"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={isPrimary}
                  sizes={isPrimary ? "(min-width: 640px) 50vw, 100vw" : "25vw"}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                {isFifth && remaining > 0 && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-brand-dark/75 backdrop-blur-[2px] transition-colors group-hover:bg-brand-dark/85">
                    <span className="web-numeric text-2xl text-on-dark-hi">+{remaining}</span>
                    <span className="web-control text-xs uppercase tracking-[0.1em] text-on-dark">
                      View all {allImages.length}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating "View all photos" button */}
      <button
        type="button"
        onClick={(event) => open(0, event)}
        className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 rounded-web-full border border-white/25 bg-brand-dark/85 px-4 py-2 text-xs uppercase tracking-wider text-on-dark-hi backdrop-blur-md shadow-web-md transition-all hover:bg-brand-dark hover:scale-105 hover:border-white/50"
      >
        <GridIcon size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" />
        <span>View all {allImages.length} photos</span>
      </button>

      {/* Full-Screen Master Lightbox Portaled to Body */}
      {mounted &&
        openIndex !== null &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title}, photo ${openIndex + 1} of ${allImages.length}`}
            tabIndex={-1}
            className="fixed inset-0 z-[1000] flex flex-col justify-between bg-[#080b18]/98 backdrop-blur-2xl text-white select-none"
          >
            {/* Top Navigation & Controls Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-brand-dark/60 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <span className="web-numeric inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white border border-white/15 shadow-sm">
                  {openIndex + 1} / {allImages.length}
                </span>
                <p className="hidden sm:inline-block text-sm text-slate-300 font-medium truncate max-w-xl">
                  {allImages[openIndex].alt || title}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-2 text-xs text-slate-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <span>← → keys to navigate</span>
                  <span className="opacity-30">|</span>
                  <span>ESC to exit</span>
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close photo viewer"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <CloseIcon size={20} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Center Viewing Stage */}
            <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
              {/* Previous Floating Button */}
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-4 sm:left-8 z-20 inline-flex size-12 sm:size-14 items-center justify-center rounded-full bg-brand-dark/85 hover:bg-brand-dark border border-white/25 hover:border-white/50 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
                >
                  <PrevIcon size={26} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </button>
              )}

              {/* Main Image View */}
              <div className="relative size-full max-w-6xl max-h-[72vh] flex items-center justify-center">
                <Image
                  src={allImages[openIndex].url}
                  alt={allImages[openIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300"
                  priority
                />
              </div>

              {/* Next Floating Button */}
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-4 sm:right-8 z-20 inline-flex size-12 sm:size-14 items-center justify-center rounded-full bg-brand-dark/85 hover:bg-brand-dark border border-white/25 hover:border-white/50 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
                >
                  <NextIcon size={26} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Bottom Interactive Thumbnails Carousel Strip */}
            {allImages.length > 1 && (
              <div className="pb-5 pt-3 px-4 flex justify-center z-20 border-t border-white/10 bg-brand-dark/60 backdrop-blur-md">
                <div className="flex items-center gap-2.5 overflow-x-auto max-w-4xl py-1 px-2 no-scrollbar">
                  {allImages.map((image, idx) => (
                    <button
                      key={`portal-thumb-${image.url}`}
                      type="button"
                      onClick={() => setOpenIndex(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                      className={cn(
                        "relative shrink-0 size-14 sm:size-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                        openIndex === idx
                          ? "border-brand-yellow scale-105 opacity-100 shadow-[0_0_15px_rgba(243,223,39,0.35)]"
                          : "border-white/15 opacity-50 hover:opacity-90 hover:border-white/40"
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
