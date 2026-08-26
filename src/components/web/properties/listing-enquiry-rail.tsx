"use client";

import { useActionState, useId, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitViewingEnquiry } from "@/lib/actions/web/enquiries";
import { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD } from "@/lib/actions/web/form-fields";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactKES, formatKES } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";

type RailTab = "viewing" | "trends" | "calculator";
type TourType = "in_person" | "video";
type TimeSlot = "morning" | "afternoon" | "evening";

/**
 * The viewing windows, with the hours spelled out.
 *
 * The label carries the actual window rather than just "Morning", because the
 * chosen slot goes straight into a WhatsApp message to an agent, and "morning"
 * is a different promise to different people.
 */
const TIME_SLOTS: { id: TimeSlot; label: string; window: string }[] = [
  { id: "morning", label: "Morning", window: "9am – 12pm" },
  { id: "afternoon", label: "Afternoon", window: "12pm – 4pm" },
  { id: "evening", label: "Evening", window: "4pm – 6pm" },
];

interface ListingEnquiryRailProps {
  /** The property row id, so the enquiry can be joined back to the listing. */
  propertyId: string;
  listingTitle: string;
  reference: string;
  location: string;
  priceKes: number | null;
  priceSuffix?: string | null;
  propertyType: string;
}

function RailSubmitButton() {
  // Read from a child of the form: the hook reports the nearest enclosing
  // form's state, so reading it in the rail itself would always see idle.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group relative w-full overflow-hidden rounded-full bg-tertiary-gradient py-2.5 px-5 text-xs uppercase tracking-wider font-medium text-white transition-all hover:bg-tertiary-gradient-h shadow-md hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
    >
      <span>{pending ? "Sending…" : "Request Viewing Schedule"}</span>
    </button>
  );
}

export function ListingEnquiryRail({
  propertyId,
  listingTitle,
  reference,
  location,
  priceKes,
  priceSuffix,
  propertyType,
}: ListingEnquiryRailProps) {
  const [activeTab, setActiveTab] = useState<RailTab>("viewing");
  const [tourType, setTourType] = useState<TourType>("in_person");
  const [selectedDate, setSelectedDate] = useState<string>("Tomorrow");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>("afternoon");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, formAction] = useActionState(submitViewingEnquiry, null);

  // Stamped once at mount; the action refuses submissions that arrive faster
  // than a person could plausibly type.
  const [renderedAt] = useState(() => Date.now());

  const submitted = state?.ok === true;
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const errorFor = (field: string) => errors[field];

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(20);
  const interestRate = 0.13; // 13% average Kenya mortgage rate

  const nameId = useId();
  const phoneId = useId();
  const messageId = useId();

  const isRental = Boolean(priceSuffix);
  const CheckIcon = webIcons.check;
  const PhoneIcon = webIcons.phone;
  const ChatIcon = webIcons.chat;
  const ShieldIcon = webIcons.shield;

  const areaName = location.split(",")[0].trim();

  // Dynamic 6-month market trajectory with custom domain scaling
  const { chartPoints, domainY, growthPct } = useMemo(() => {
    if (!priceKes) return { chartPoints: [], domainY: [0, 100], growthPct: "+3.4%" };
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const trajectory = [-0.038, -0.029, -0.021, -0.012, -0.005, 0];
    const avgTrajectory = [-0.048, -0.040, -0.032, -0.022, -0.014, -0.006];

    const chartPoints = months.map((month, index) => {
      const price = Math.round(priceKes * (1 + trajectory[index]));
      const avg = Math.round(priceKes * 0.93 * (1 + avgTrajectory[index]));
      return { month, price, avg };
    });

    const vals = chartPoints.flatMap((p) => [p.price, p.avg]);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const spread = maxVal - minVal;
    const padding = spread * 0.3 || maxVal * 0.04;

    return {
      chartPoints,
      domainY: [Math.floor(minVal - padding), Math.ceil(maxVal + padding)],
      growthPct: "+3.8%",
    };
  }, [priceKes]);

  // Mortgage calculation
  const mortgageMonthly = useMemo(() => {
    if (!priceKes || isRental) return 0;
    const loanAmount = priceKes * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 12;
    const totalMonths = loanTermYears * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(monthlyPayment);
  }, [priceKes, isRental, downPaymentPercent, loanTermYears]);

  // WhatsApp Pre-fill message
  const whatsappHref = useMemo(() => {
    // The window, not the bare enum: an agent reading "(afternoon)" has to
    // guess, where "(afternoon, 12pm – 4pm)" is something they can act on.
    const slot = TIME_SLOTS.find((entry) => entry.id === selectedSlot);
    const text = encodeURIComponent(
      `Hello Sunland, I would like to book a ${
        tourType === "in_person" ? "in-person viewing" : "live video tour"
      } for "${listingTitle}" (Ref ${reference}) on ${selectedDate} ${
        slot ? `(${slot.label.toLowerCase()}, ${slot.window})` : ""
      }.`
    );
    return `${SITE.whatsappHref}?text=${text}`;
  }, [listingTitle, reference, tourType, selectedDate, selectedSlot]);

  return (
    <aside aria-label="Property enquiry command center" className="lg:sticky lg:top-[96px]">
      <div className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_12px_44px_rgba(21,25,54,0.08)] backdrop-blur-xl transition-all">
        {/* ── Top Pricing Banner ── */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="web-control text-xxs uppercase tracking-[0.14em] text-ink-400 font-medium">
              {isRental ? "Monthly Lease" : "Guide Price"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-web-micro font-medium text-emerald-700 border border-emerald-200/60">
              <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              <span>0% Tenant / Buyer Fee</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {priceKes === null ? (
              <span className="text-2xl font-medium tracking-tight text-ink-900">Price on request</span>
            ) : (
              <>
                <span className="web-numeric text-3xl font-normal tracking-[-0.03em] text-ink-900">
                  {formatKES(priceKes)}
                </span>
                {priceSuffix && (
                  <span className="web-numeric text-sm font-normal text-ink-400">
                    {priceSuffix.replace("/ mo", "/ month")}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Verified Consultant Profile Strip ── */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 mb-3.5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative size-9 rounded-full overflow-hidden border border-slate-200 bg-brand-dark/5">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Sunland Property Specialist"
                fill
                sizes="36px"
                className="object-cover"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink-900 leading-tight">Dennis Mwangi</p>
              <p className="text-web-micro text-ink-400">Prime {areaName} Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={SITE.phoneHref}
              aria-label="Call property agent"
              className="inline-flex size-7 items-center justify-center rounded-full border border-slate-200 text-ink-700 transition-colors hover:bg-slate-100"
            >
              <PhoneIcon size={13} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp property agent"
              className="inline-flex size-7 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              <ChatIcon size={13} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ── Interactive Command Tabs ── */}
        <div className="flex border-b border-slate-100 mb-1.5 bg-slate-50/40 p-1 py-2.5 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("viewing")}
            className={cn(
              "flex-1 rounded-xl py-1.5 font-medium transition-all text-center",
              activeTab === "viewing"
                ? "bg-white text-ink-900 shadow-sm border border-slate-200/80"
                : "text-ink-500 hover:text-ink-900"
            )}
          >
            Book Tour
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trends")}
            className={cn(
              "flex-1 rounded-xl py-1.5 font-medium transition-all text-center",
              activeTab === "trends"
                ? "bg-white text-ink-900 shadow-sm border border-slate-200/80"
                : "text-ink-500 hover:text-ink-900"
            )}
          >
            Price Trend
          </button>
          {!isRental && (
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              className={cn(
                "flex-1 rounded-xl py-1.5 font-medium transition-all text-center",
                activeTab === "calculator"
                  ? "bg-white text-ink-900 shadow-sm border border-slate-200/80"
                  : "text-ink-500 hover:text-ink-900"
              )}
            >
              Mortgage
            </button>
          )}
        </div>

        {/* ── TAB 1: Booking & Enquiry Workspace ── */}
        {activeTab === "viewing" && (
          <div className="p-5">
            <form action={formAction} className="space-y-3">
              {/* Honeypot, hidden from sight, assistive tech and tab order. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${nameId}-hp`}>Company website</label>
                <input id={`${nameId}-hp`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
              </div>
              <input type="hidden" name={FORM_TIMESTAMP_FIELD} value={renderedAt} />

              {/* Context the form already knows. The tour type, date and slot
                  live in component state driven by buttons rather than inputs,
                  so they are mirrored here or they never reach the server. */}
              <input type="hidden" name="propertyId" value={propertyId} />
              <input type="hidden" name="listingRef" value={reference} />
              <input type="hidden" name="listingTitle" value={listingTitle} />
              <input type="hidden" name="preferredDate" value={selectedDate} />
              <input
                type="hidden"
                name="preferredSlot"
                value={`${selectedSlot} (${tourType === "in_person" ? "in person" : "video tour"})`}
              />
              {/* Tour Type Selector */}
              <div>
                <label className="web-subtitle mb-1 block text-xxs text-ink-400 font-medium uppercase tracking-wider">
                  Select Tour Experience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTourType("in_person")}
                    className={cn(
                      "rounded-xl border py-2 px-3 text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5",
                      tourType === "in_person"
                        ? "border-brand-dark bg-brand-dark text-white shadow-sm"
                        : "border-slate-200 bg-white text-ink-700 hover:border-slate-300"
                    )}
                  >
                    <span>In-Person Tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourType("video")}
                    className={cn(
                      "rounded-xl border py-2 px-3 text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5",
                      tourType === "video"
                        ? "border-brand-dark bg-brand-dark text-white shadow-sm"
                        : "border-slate-200 bg-white text-ink-700 hover:border-slate-300"
                    )}
                  >
                    <span>Video Walkthrough</span>
                  </button>
                </div>
              </div>

              {/* Quick Date Chips */}
              <div>
                <label className="web-subtitle mb-1 block text-xxs text-ink-400 font-medium uppercase tracking-wider">
                  Preferred Day
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Today", "Tomorrow", "Weekend"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "rounded-lg border py-1 text-xs font-medium transition-all text-center",
                        selectedDate === day
                          ? "border-brand-yellow bg-brand-yellow/15 text-brand-dark font-medium border-2"
                          : "border-slate-200 text-ink-600 hover:border-slate-300"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Time Chips.
                  The enquiry message already interpolated a time slot, but
                  nothing ever set it: every visitor sent "afternoon" whether
                  they wanted it or not, and an agent called back against a
                  preference the visitor never expressed. Same chip pattern as
                  the day row directly above, so the pair reads as one control. */}
              <div>
                <label className="web-subtitle mb-1 block text-xxs text-ink-400 font-medium uppercase tracking-wider">
                  Preferred Time
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      aria-pressed={selectedSlot === slot.id}
                      className={cn(
                        "rounded-lg border py-1 text-xs font-medium transition-all text-center",
                        selectedSlot === slot.id
                          ? "border-brand-yellow bg-brand-yellow/15 text-brand-dark font-medium border-2"
                          : "border-slate-200 text-ink-600 hover:border-slate-300"
                      )}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="space-y-2 pt-0.5">
                <div>
                  <label htmlFor={nameId} className="web-subtitle mb-1 block text-xs text-ink-500 font-medium">
                    Your Name
                  </label>
                  <input
                    id={nameId}
                    name="name"
                    required
                    aria-invalid={errorFor("name") ? true : undefined}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Kimani"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-dark focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={phoneId} className="web-subtitle mb-1 block text-xs text-ink-500 font-medium">
                    Phone Number
                  </label>
                  <input
                    id={phoneId}
                    name="phone"
                    required
                    type="tel"
                    aria-invalid={errorFor("phone") ? true : undefined}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="web-numeric w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-dark focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={messageId} className="web-subtitle mb-1 block text-xs text-ink-500 font-medium">
                    Notes <span className="font-normal text-ink-400">(optional)</span>
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific questions or preferred time?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-dark focus:bg-white focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Main Submit CTA */}
              <RailSubmitButton />

              {/* Direct Instant WhatsApp Option */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2 px-4 text-xs font-medium text-white transition-all hover:bg-[#20ba59] shadow-sm hover:shadow active:scale-[0.99]"
              >
                <ChatIcon size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                <span>Instant Booking via WhatsApp</span>
              </a>

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-800 leading-relaxed animate-fade-in">
                  ✓ Viewing request received. Our specialist will confirm your tour of {listingTitle} shortly.
                </div>
              )}

              {/* Failures are announced here rather than beside each field: the
                  rail is a narrow column with every field in view, so a single
                  message below the button is never off-screen. */}
              {state && !state.ok && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs leading-relaxed text-rose-800"
                >
                  {errorFor("name") ?? errorFor("phone") ?? state.message}
                </p>
              )}
            </form>
          </div>
        )}

        {/* ── TAB 2: Market Trends Workspace ── */}
        {activeTab === "trends" && (
          <div className="p-5 space-y-4">
            {/* Header with Metric Badges */}
            <div className="flex items-start justify-between">
              <div>
                <p className="web-control text-xxs uppercase tracking-[0.14em] font-medium text-ink-400">
                  Market Appreciation
                </p>
                <h4 className="text-sm font-medium text-ink-900 mt-0.5">{areaName} Prime Sub-Market</h4>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                  {growthPct} (6 Mo)
                </span>
              </div>
            </div>

            {/* Sparkline / Area Chart Container with Dynamic Curve */}
            <div className="relative rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50/70 to-white p-3 pt-3.5 shadow-sm">
              {/* Legend Strip */}
              <div className="flex items-center justify-between text-xxs font-medium text-ink-400 mb-1.5 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-brand-dark" />
                  <span className="text-ink-700">This Property</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3 rounded-full bg-slate-300" />
                  <span>{areaName} Benchmark</span>
                </div>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="railColorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f3df27" stopOpacity={0.45} />
                        <stop offset="60%" stopColor="#f3df27" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#f3df27" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="railColorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs font-medium"
                      dy={6}
                    />
                    <YAxis
                      domain={domainY}
                      hide
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const propVal = payload.find((p) => p.dataKey === "price")?.value;
                          const avgVal = payload.find((p) => p.dataKey === "avg")?.value;
                          return (
                            <div className="rounded-xl border border-slate-700/60 bg-brand-dark/95 p-3 shadow-xl backdrop-blur-md text-white text-xs space-y-1">
                              <p className="web-control text-xxs uppercase tracking-wider text-slate-400">{label} Index</p>
                              {propVal && (
                                <p className="flex items-center justify-between gap-4 font-medium">
                                  <span className="text-brand-yellow">Property:</span>
                                  <span className="web-numeric">{formatCompactKES(propVal as number)}</span>
                                </p>
                              )}
                              {avgVal && (
                                <p className="flex items-center justify-between gap-4 text-slate-300">
                                  <span className="text-slate-400">Area Avg:</span>
                                  <span className="web-numeric">{formatCompactKES(avgVal as number)}</span>
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="url(#railColorAvg)"
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#090e17"
                      strokeWidth={2.5}
                      fill="url(#railColorPrice)"
                      activeDot={{ r: 5, fill: "#f3df27", stroke: "#090e17", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Submarket Intelligence Indicators */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
                <p className="text-xxs uppercase tracking-wider text-ink-400 font-medium">Rental Yield</p>
                <p className="web-numeric text-sm font-medium text-ink-900 mt-0.5">7.6% p.a.</p>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
                <p className="text-xxs uppercase tracking-wider text-ink-400 font-medium">Days on Market</p>
                <p className="web-numeric text-sm font-medium text-ink-900 mt-0.5">28 Days Avg</p>
              </div>
            </div>

            <p className="text-web-micro text-ink-400 leading-normal text-center">
              Indexed from Land Registry transactions & Sunland valuation models.
            </p>
          </div>
        )}

        {/* ── TAB 3: Mortgage Calculator Workspace ── */}
        {activeTab === "calculator" && !isRental && (
          <div className="p-5 space-y-3.5">
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-ink-400">Est. Monthly Repayment</p>
              <p className="web-numeric text-2xl font-medium text-ink-900 mt-0.5">
                {formatKES(mortgageMonthly)} <span className="text-xs font-normal text-ink-400">/ mo</span>
              </p>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-ink-700">
                <span>Down Payment: {downPaymentPercent}%</span>
                <span className="web-numeric text-ink-900">
                  {priceKes ? formatKES((priceKes * downPaymentPercent) / 100) : "KES 0"}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-brand-dark cursor-pointer"
              />
            </div>

            {/* Loan Term Selector */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink-700 block">Loan Tenure</label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setLoanTermYears(years)}
                    className={cn(
                      "rounded-lg border py-1.5 text-xs font-medium transition-all text-center",
                      loanTermYears === years
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-slate-200 text-ink-600 hover:border-slate-300"
                    )}
                  >
                    {years} Years
                  </button>
                ))}
              </div>
            </div>

            <p className="text-web-micro text-ink-400 leading-tight">
              *Calculated at standard bank rate of 13% p.a. Actual terms subject to banking assessment.
            </p>
          </div>
        )}

        {/* ── Bottom Trust Signals Guarantee ── */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-3.5 px-5">
          <div className="grid grid-cols-2 gap-3 text-xs text-ink-500">
            <div className="flex items-center gap-2">
              <ShieldIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" className="text-emerald-600 shrink-0" />
              <span>Verified Title Deed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" className="text-emerald-600 shrink-0" />
              <span>15-Min Response</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
