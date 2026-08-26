"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconArchive,
  IconArrowUpRight,
  IconBan,
  IconCheck,
  IconHome2,
  IconMail,
  IconMessageCircle,
  IconMoodEmpty,
  IconPhone,
  IconSearch,
  IconWorld,
} from "@tabler/icons-react";
import {
  Badge,
  BoardHeader,
  Button,
  EmptyState,
  SkeletonBlock,
} from "@/components/ui/erp-primitives";
import { PageTransition } from "@/components/shared/page-transition";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils/cn";

/**
 * The public site's enquiry inbox.
 *
 * The five marketing forms write to `web_enquiries` rather than straight into
 * the pipeline, because the public site has no captcha and `crm.leads` is a
 * surface people work from all day. This is where those submissions are read
 * and either accepted into the pipeline or thrown away.
 *
 * Without this screen the staging decision is just a slower way of discarding
 * enquiries, so treat "nobody opens this" as a bug rather than a preference.
 *
 * Toasts are correct *here*, unlike on the public site: an admin who presses
 * Convert stays on a list that re-fetches under them, so the confirmation has
 * no other home. Visitor-facing forms report inline instead.
 */

type EnquiryKind = "viewing" | "valuation" | "contact";
type EnquiryStatus = "new" | "triaged" | "converted" | "spam" | "archived";

interface WebEnquiry {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  propertyId: string | null;
  propertyName: string | null;
  areaSlug: string | null;
  preferredDate: string | null;
  preferredSlot: string | null;
  metadata: Record<string, unknown> | null;
  sourcePath: string | null;
  convertedLeadId: string | null;
  reviewedByName: string | null;
  createdAt: string | null;
}

const KIND_META: Record<
  EnquiryKind,
  { label: string; icon: typeof IconHome2; tone: "brand" | "data" | "neutral" }
> = {
  viewing: { label: "Viewing", icon: IconHome2, tone: "brand" },
  valuation: { label: "Valuation", icon: IconArrowUpRight, tone: "data" },
  contact: { label: "General", icon: IconMessageCircle, tone: "neutral" },
};

const TABS: { id: EnquiryStatus | "open"; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "converted", label: "Converted" },
  { id: "spam", label: "Spam" },
  { id: "archived", label: "Archived" },
];

function relativeTime(iso: string | null) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString();
}

export function WebEnquiriesBoard({ entityId }: { entityId?: string | null }) {
  const { pushToast } = useToast();
  const [enquiries, setEnquiries] = useState<WebEnquiry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<EnquiryStatus | "open">("open");
  const [kind, setKind] = useState<EnquiryKind | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // Tracks the row being acted on, so only that card's buttons disable —
  // freezing the whole board because one row is converting is worse feedback
  // than none.
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: tab });
      if (kind !== "all") params.set("kind", kind);
      if (search.trim()) params.set("search", search.trim());
      if (entityId) params.set("entityId", entityId);

      const response = await fetch(`/api/web-enquiries?${params}`);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = await response.json();
      setEnquiries(data.enquiries ?? []);
      setCounts(data.counts?.byStatus ?? {});
    } catch (error) {
      console.error("[web-enquiries] load failed", error);
      pushToast({
        tone: "error",
        title: "Inbox unavailable",
        body: "Could not load website enquiries.",
      });
    } finally {
      setLoading(false);
    }
  }, [tab, kind, search, entityId, pushToast]);

  useEffect(() => {
    // Debounced so typing in the search box does not fire a request per key.
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  // useCallback because the memoised list below depends on it. Declared as a
  // plain function it would be a new reference every render, which makes that
  // dependency list a lie and the memo pointless.
  const act = useCallback(
    async (enquiry: WebEnquiry, body: Record<string, unknown>, successMessage: string) => {
      setBusyId(enquiry.id);
      try {
        const response = await fetch(`/api/web-enquiries/${enquiry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, entityId }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Request failed");

        pushToast({ tone: "success", title: successMessage });
        await load();
      } catch (error) {
        pushToast({
          tone: "error",
          title: "That did not work",
          body: error instanceof Error ? error.message : undefined,
        });
      } finally {
        setBusyId(null);
      }
    },
    [entityId, load, pushToast]
  );

  const openCount = (counts.new ?? 0) + (counts.triaged ?? 0);

  const tabCount = useCallback(
    (id: EnquiryStatus | "open") => (id === "open" ? openCount : (counts[id] ?? 0)),
    [counts, openCount]
  );

  const body = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (enquiries.length === 0) {
      return (
        <EmptyState
          icon={IconMoodEmpty}
          title={tab === "open" ? "Nothing waiting" : "Nothing here"}
          description={
            tab === "open"
              ? "Every website enquiry has been dealt with. New ones land here as they arrive."
              : "No enquiries in this state yet."
          }
          action="Refresh"
          onClick={load}
        />
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {enquiries.map((enquiry) => {
          const meta = KIND_META[enquiry.kind];
          const KindIcon = meta.icon;
          const isBusy = busyId === enquiry.id;
          const isOpen = enquiry.status === "new" || enquiry.status === "triaged";

          return (
            <article
              key={enquiry.id}
              className={cn(
                "rounded-xl border border-[var(--outline)] bg-white p-4 transition",
                isBusy && "opacity-60"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={meta.tone}>
                      <KindIcon size={12} aria-hidden="true" />
                      {meta.label}
                    </Badge>
                    {enquiry.status === "new" && <Badge tone="warning">New</Badge>}
                    {enquiry.status === "converted" && <Badge tone="success">Converted</Badge>}
                    <span className="text-sm text-[var(--on-surface-dim)]">
                      {relativeTime(enquiry.createdAt)}
                    </span>
                  </div>

                  <h3 className="mt-2 truncate font-medium text-[var(--on-surface)]">
                    {enquiry.name}
                  </h3>

                  {/* Reply channels. Real links, because the point of this
                      screen is to answer someone, not to look at them. */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--on-surface-dim)]">
                    {enquiry.phone && (
                      <a
                        href={`tel:${enquiry.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--on-surface)]"
                      >
                        <IconPhone size={14} aria-hidden="true" />
                        {enquiry.phone}
                      </a>
                    )}
                    {enquiry.email && (
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--on-surface)]"
                      >
                        <IconMail size={14} aria-hidden="true" />
                        {enquiry.email}
                      </a>
                    )}
                    {enquiry.sourcePath && (
                      <span className="inline-flex items-center gap-1.5">
                        <IconWorld size={14} aria-hidden="true" />
                        {enquiry.sourcePath}
                      </span>
                    )}
                  </div>

                  {(enquiry.propertyName || enquiry.preferredDate || enquiry.areaSlug) && (
                    <p className="mt-2 text-sm text-[var(--on-surface-dim)]">
                      {enquiry.propertyName && <strong>{enquiry.propertyName}</strong>}
                      {enquiry.preferredDate && (
                        <>
                          {enquiry.propertyName ? " · " : ""}
                          {enquiry.preferredDate} {enquiry.preferredSlot ?? ""}
                        </>
                      )}
                      {!enquiry.propertyName && enquiry.areaSlug && `Area: ${enquiry.areaSlug}`}
                    </p>
                  )}

                  {enquiry.message && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--on-surface)]">
                      {enquiry.message}
                    </p>
                  )}
                </div>

                {isOpen && (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isBusy || (!enquiry.email && !enquiry.phone)}
                      title={
                        !enquiry.email && !enquiry.phone
                          ? "No email or phone, so there is no contact to create"
                          : undefined
                      }
                      onClick={() =>
                        act(
                          enquiry,
                          { action: "convert" },
                          `${enquiry.name} added to the pipeline.`
                        )
                      }
                    >
                      <IconCheck size={14} aria-hidden="true" />
                      Convert
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() =>
                        act(enquiry, { action: "status", status: "spam" }, "Marked as spam.")
                      }
                    >
                      <IconBan size={14} aria-hidden="true" />
                      Spam
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() =>
                        act(enquiry, { action: "status", status: "archived" }, "Archived.")
                      }
                    >
                      <IconArchive size={14} aria-hidden="true" />
                      Archive
                    </Button>
                  </div>
                )}

                {enquiry.status === "converted" && enquiry.reviewedByName && (
                  <span className="shrink-0 text-sm text-[var(--on-surface-dim)]">
                    by {enquiry.reviewedByName}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    );
  }, [enquiries, loading, busyId, tab, load, act]);

  return (
    <PageTransition>
      <BoardHeader
        eyebrow="Public website"
        title="Enquiry inbox"
        description="Submissions from the marketing site. Accepting one creates the contact and the lead; nothing reaches the pipeline until you say so."
        meta={openCount > 0 ? `${openCount} awaiting a decision` : "Nothing awaiting a decision"}
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={cn(
                "focus-ring inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                tab === entry.id
                  ? "border-transparent bg-tertiary-gradient text-white"
                  : "border-[var(--outline)] bg-white text-[var(--on-surface-dim)] hover:text-[var(--on-surface)]"
              )}
            >
              {entry.label}
              <span className="tabular-nums opacity-70">{tabCount(entry.id)}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search enquiries</span>
            <IconSearch
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-dim)]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, phone, message"
              className="focus-ring h-9 w-64 rounded-lg border border-[var(--outline)] bg-white pl-9 pr-3 text-sm"
            />
          </label>

          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as EnquiryKind | "all")}
            aria-label="Filter by enquiry type"
            className="focus-ring h-9 rounded-lg border border-[var(--outline)] bg-white px-3 text-sm"
          >
            <option value="all">All types</option>
            <option value="viewing">Viewing</option>
            <option value="valuation">Valuation</option>
            <option value="contact">General</option>
          </select>
        </div>
      </div>

      <div className="mt-5">{body}</div>
    </PageTransition>
  );
}
