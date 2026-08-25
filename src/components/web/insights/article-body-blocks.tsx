"use client";

import { useState } from "react";
import { type ArticleBlock } from "@/components/web/constants/insights.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { ArticleInteractiveChart } from "./article-interactive-chart";

interface Props {
  blocks: ArticleBlock[];
  slug: string;
}

export function ArticleBodyBlocks({ blocks, slug }: Props) {
  let h2Count = 0;

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.kind === "h2") {
          h2Count += 1;
        }

        return (
          <div key={`${block.kind}-${index}`}>
            <RenderBlock block={block} index={index} h2Index={h2Count} slug={slug} />
            {/* Insert interactive data visualization after the first H2 section */}
            {block.kind === "h2" && h2Count === 1 && (
              <ArticleInteractiveChart slug={slug} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RenderBlock({
  block,
  index,
  h2Index,
  slug,
}: {
  block: ArticleBlock;
  index: number;
  h2Index: number;
  slug: string;
}) {
  switch (block.kind) {
    case "lead":
      return (
        <div className="my-8 border-l-2 border-brand-yellow pl-5 sm:pl-7">
          <p className="font-editorial text-[20px] sm:text-[22px] leading-[1.65] text-[#151936] font-normal">
            {block.text}
          </p>
        </div>
      );

    case "p":
      return (
        <p className="text-[17.5px] sm:text-[18.5px] leading-[1.82] text-slate-700 font-normal my-4">
          {block.text}
        </p>
      );

    case "h2": {
      const anchorId = `section-${h2Index}`;
      const cleanTitle = block.text.replace(/^\d+\.\s*/, "");

      return (
        <div id={anchorId} className="scroll-mt-28 pt-8 sm:pt-10 border-t border-line-soft mt-10 sm:mt-14 mb-4">
          <h2 className="font-editorial text-2xl sm:text-[28px] lg:text-[32px] font-medium leading-[1.2] text-[#151936] flex items-baseline gap-3">
            <span className="font-mono text-base sm:text-lg text-slate-400 font-semibold shrink-0">
              0{h2Index}.
            </span>
            <span>{cleanTitle}</span>
          </h2>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote className="my-10 border-l-3 border-[#151936] pl-6 sm:pl-8 py-1.5">
          <p className="font-editorial text-xl sm:text-[23px] font-medium leading-[1.5] text-[#151936] italic">
            “{block.text}”
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 mt-2.5 font-medium">
            Practitioner Standard & Policy
          </p>
        </blockquote>
      );

    case "compare":
      return (
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {block.items.map((item, idx) => {
            const isAligned = idx === 0;
            return (
              <div
                key={item.title}
                className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 shadow-2xs ${
                  isAligned
                    ? "border-emerald-300 bg-emerald-50/50 text-slate-800"
                    : "border-line bg-surface-1 text-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-semibold ${
                        isAligned
                          ? "bg-emerald-700 text-white"
                          : "bg-[#151936] text-white"
                      }`}
                    >
                      {isAligned ? "✓ Recommended Basis" : "⚠ Adverse Practice"}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Option {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-medium text-[#151936]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-600 font-normal">
                    {item.body}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-400">Verdict:</span>
                  <span
                    className={`font-medium ${
                      isAligned ? "text-emerald-800" : "text-slate-700"
                    }`}
                  >
                    {isAligned ? "Protects Landlord Cashflow" : "Transfers Risk to Landlord"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );

    case "checklist":
      return <InteractiveChecklist items={block.items} />;
  }
}

function InteractiveChecklist({ items }: { items: string[] }) {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});
  const CheckIcon = webIcons.check;

  const toggleCheck = (index: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const checkedCount = Object.values(checkedState).filter(Boolean).length;

  return (
    <div className="my-10 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-brand-yellow" />
          <h3 className="font-editorial text-lg sm:text-xl font-medium text-[#151936]">
            Verification & Audit Checklist
          </h3>
        </div>
        <span className="rounded-full bg-surface-1 border border-line px-3 py-1 font-mono text-[11px] font-medium text-slate-600">
          {checkedCount} of {items.length} verified
        </span>
      </div>

      <ul className="divide-y divide-line-soft">
        {items.map((item, idx) => {
          const isChecked = Boolean(checkedState[idx]);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`w-full flex items-start gap-3.5 py-3.5 px-2 text-left rounded-lg transition-colors cursor-pointer ${
                  isChecked
                    ? "bg-emerald-50/40 text-emerald-950"
                    : "hover:bg-surface-1 text-slate-700"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    isChecked
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  <CheckIcon size={13} stroke={2.5} />
                </span>
                <span
                  className={`text-[15.5px] leading-relaxed transition-colors ${
                    isChecked ? "text-emerald-950 font-medium" : "text-slate-700 font-normal"
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-right font-mono text-[11px] text-slate-400">
        Click items to check off provisions during your document review.
      </p>
    </div>
  );
}
