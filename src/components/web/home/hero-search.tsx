"use client";

import {
  IconBed,
  IconBuilding,
  IconBuildingSkyscraper,
  IconCheck,
  IconChevronDown,
  IconCoin,
  IconHome,
  IconMapPin,
  IconSearch,
  IconTree,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type DropdownKey = "location" | "type" | "beds" | "budget" | null;

const PROPERTY_TYPES = [
  { value: "", label: "Any property type", icon: IconBuildingSkyscraper },
  { value: "apartments", label: "Apartments & Flats", icon: IconBuilding },
  { value: "villas", label: "Villas & Houses", icon: IconHome },
  { value: "commercial", label: "Commercial Space", icon: IconBuildingSkyscraper },
  { value: "land", label: "Prime Land & Plots", icon: IconTree },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any beds" },
  { value: "1", label: "1+ Bed" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
];

const RENT_BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "0-80000", label: "Under KES 80k / mo" },
  { value: "80000-150000", label: "KES 80k – 150k / mo" },
  { value: "150000-300000", label: "KES 150k – 300k / mo" },
  { value: "300000-", label: "KES 300k+ / mo" },
];

const SALE_BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "0-20000000", label: "Under KES 20M" },
  { value: "20000000-50000000", label: "KES 20M – 50M" },
  { value: "50000000-120000000", label: "KES 50M – 120M" },
  { value: "120000000-", label: "KES 120M+" },
];

export function HeroSearch({ areas }: { areas: string[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"for-rent" | "for-sale">("for-rent");
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budget, setBudget] = useState("");

  const locationId = useId();

  // Close dropdowns on outside click or escape
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleStatus = (nextStatus: "for-rent" | "for-sale") => {
    setStatus(nextStatus);
    setBudget(""); // Reset budget on status change since tiers differ
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenDropdown(null);

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (budget) params.set("budget", budget);

    router.push(`/properties/${status}?${params.toString()}`);
  };

  // Filtered areas for location combobox
  const filteredAreas = areas.filter((a) =>
    a.toLowerCase().includes(location.toLowerCase().trim())
  );

  const currentTypeLabel = PROPERTY_TYPES.find((t) => t.value === type)?.label ?? "Any type";
  const currentBedLabel = BEDROOM_OPTIONS.find((b) => b.value === bedrooms)?.label ?? "Any beds";
  const budgetOptions = status === "for-rent" ? RENT_BUDGETS : SALE_BUDGETS;
  const currentBudgetLabel = budgetOptions.find((b) => b.value === budget)?.label ?? "Any budget";

  const toggleClass = (active: boolean) =>
    cn(
      "web-control rounded-full px-4.5 py-2 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
      active
        ? "bg-tertiary-gradient text-white font-medium shadow-xs"
        : "text-slate-600 hover:text-slate-900 font-medium"
    );

  const labelClass =
    "web-control block text-web-nano uppercase tracking-[0.16em] text-slate-400 font-medium mb-0.5 pointer-events-none";

  return (
    <search className="w-full relative">
      <form
        ref={formRef}
        aria-label="Property search"
        onSubmit={handleSearchSubmit}
        className="w-full rounded-2xl lg:rounded-full border border-white/90 bg-white/[0.96] backdrop-blur-3xl p-2 sm:p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white/[0.98] relative z-raised"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0 w-full">
          {/* 01. Status Toggle Capsule */}
          <div className="flex items-center lg:pl-1 lg:pr-2">
            <div className="inline-flex p-1 rounded-full bg-slate-100/90 border border-slate-200/80">
              <button
                type="button"
                onClick={() => toggleStatus("for-rent")}
                aria-pressed={status === "for-rent"}
                className={toggleClass(status === "for-rent")}
              >
                To let
              </button>
              <button
                type="button"
                onClick={() => toggleStatus("for-sale")}
                aria-pressed={status === "for-sale"}
                className={toggleClass(status === "for-sale")}
              >
                For sale
              </button>
            </div>
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-200/80 mx-1 shrink-0" />

          {/* 02. Location Field with Custom Autocomplete Popover */}
          <div className="relative flex-1 min-w-0">
            <div
              className={cn(
                "px-3.5 py-1.5 rounded-xl lg:rounded-full transition-all",
                openDropdown === "location"
                  ? "bg-slate-100/90 shadow-inner"
                  : "hover:bg-slate-100/60"
              )}
            >
              <label htmlFor={locationId} className={labelClass}>
                Location
              </label>
              <div className="flex items-center gap-1.5">
                <IconMapPin size={14} className="text-slate-400 shrink-0 pointer-events-none" />
                <input
                  ref={locationInputRef}
                  id={locationId}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (openDropdown !== "location") setOpenDropdown("location");
                  }}
                  onClick={() => setOpenDropdown("location")}
                  onFocus={() => setOpenDropdown("location")}
                  placeholder="Kilimani, Runda, Nyali..."
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none truncate cursor-pointer"
                />
              </div>
            </div>

            {/* Custom Location Suggestions Popover */}
            {openDropdown === "location" && (
              <div className="absolute left-0 bottom-full mb-3 w-full sm:w-[320px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.1)] p-3 z-dropdown animate-in fade-in slide-in-from-bottom-2 duration-150">
                <p className="text-web-nano uppercase font-mono tracking-widest text-slate-400 font-medium px-2 mb-2">
                  Popular Locations
                </p>
                <div className="max-h-[220px] overflow-y-auto space-y-0.5">
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => {
                          setLocation(area);
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          "web-hit w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                          location.toLowerCase() === area.toLowerCase()
                            ? "bg-slate-100 text-ink-900"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <IconMapPin size={13} className="text-slate-400" />
                          <span>{area}</span>
                        </span>
                        {location.toLowerCase() === area.toLowerCase() && (
                          <IconCheck size={14} className="text-ink-900" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-xs text-slate-400 font-mono">
                      No matching areas found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-200/80 mx-1 shrink-0" />

          {/* 03. Custom Property Type Dropdown */}
          <div className="relative w-full lg:w-[170px] min-w-0">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
              className={cn(
                "web-hit w-full text-left px-3.5 py-1.5 rounded-xl lg:rounded-full transition-all cursor-pointer",
                openDropdown === "type" ? "bg-slate-100/90 shadow-inner" : "hover:bg-slate-100/60"
              )}
            >
              <span className={labelClass}>Type</span>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconBuildingSkyscraper size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-900 font-medium truncate">
                    {currentTypeLabel}
                  </span>
                </div>
                <IconChevronDown
                  size={13}
                  className={cn(
                    "text-slate-400 shrink-0 transition-transform duration-200",
                    openDropdown === "type" && "rotate-180"
                  )}
                />
              </div>
            </button>

            {/* Custom Type Popover */}
            {openDropdown === "type" && (
              <div className="absolute left-0 bottom-full mb-3 w-[220px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.1)] p-2 z-dropdown animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-0.5">
                {PROPERTY_TYPES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = type === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setType(item.value);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "web-hit w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                        isSelected
                          ? "bg-slate-100 text-ink-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} className="text-slate-400" />
                        <span>{item.label}</span>
                      </span>
                      {isSelected && <IconCheck size={14} className="text-ink-900" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-200/80 mx-1 shrink-0" />

          {/* 04. Custom Bedrooms Dropdown */}
          <div className="relative w-full lg:w-[130px] min-w-0">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "beds" ? null : "beds")}
              className={cn(
                "web-hit w-full text-left px-3.5 py-1.5 rounded-xl lg:rounded-full transition-all cursor-pointer",
                openDropdown === "beds" ? "bg-slate-100/90 shadow-inner" : "hover:bg-slate-100/60"
              )}
            >
              <span className={labelClass}>Beds</span>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconBed size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-900 font-medium truncate">
                    {currentBedLabel}
                  </span>
                </div>
                <IconChevronDown
                  size={13}
                  className={cn(
                    "text-slate-400 shrink-0 transition-transform duration-200",
                    openDropdown === "beds" && "rotate-180"
                  )}
                />
              </div>
            </button>

            {/* Custom Beds Popover */}
            {openDropdown === "beds" && (
              <div className="absolute left-0 bottom-full mb-3 w-[160px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.1)] p-2 z-dropdown animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-0.5">
                {BEDROOM_OPTIONS.map((item) => {
                  const isSelected = bedrooms === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setBedrooms(item.value);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "web-hit w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                        isSelected
                          ? "bg-slate-100 text-ink-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span>{item.label}</span>
                      {isSelected && <IconCheck size={14} className="text-ink-900" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-200/80 mx-1 shrink-0" />

          {/* 05. Custom Budget Dropdown */}
          <div className="relative w-full lg:w-[180px] min-w-0">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "budget" ? null : "budget")}
              className={cn(
                "web-hit w-full text-left px-3.5 py-1.5 rounded-xl lg:rounded-full transition-all cursor-pointer",
                openDropdown === "budget" ? "bg-slate-100/90 shadow-inner" : "hover:bg-slate-100/60"
              )}
            >
              <span className={labelClass}>Budget ({status === "for-rent" ? "Rent" : "Buy"})</span>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconCoin size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-900 font-medium truncate">
                    {currentBudgetLabel}
                  </span>
                </div>
                <IconChevronDown
                  size={13}
                  className={cn(
                    "text-slate-400 shrink-0 transition-transform duration-200",
                    openDropdown === "budget" && "rotate-180"
                  )}
                />
              </div>
            </button>

            {/* Custom Budget Popover */}
            {openDropdown === "budget" && (
              <div className="absolute left-0 lg:right-0 lg:left-auto bottom-full mb-3 w-[220px] rounded-2xl bg-white border border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.1)] p-2 z-dropdown animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-0.5">
                {budgetOptions.map((item) => {
                  const isSelected = budget === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setBudget(item.value);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "web-hit w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                        isSelected
                          ? "bg-slate-100 text-ink-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span>{item.label}</span>
                      {isSelected && <IconCheck size={14} className="text-ink-900" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 06. Submit CTA */}
          <div className="lg:pl-2 shrink-0">
            <button
              type="submit"
              className="web-control w-full lg:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl lg:rounded-full bg-brand-yellow hover:bg-brand-yellow-lift active:bg-brand-yellow-h px-7 text-xs uppercase tracking-[0.14em] font-medium text-ink-900 shadow-[0_4px_18px_rgba(243,223,39,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <IconSearch size={15} stroke={2.5} aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </search>
  );
}
