/**
 * Insights content, from the Claude Design insights and article templates.
 *
 * ── On what ships ──
 *
 * The design lists seven articles and writes one of them in full. Only
 * articles with a body are published; the other six are held here with their
 * real titles, summaries, categories and dates so the editorial plan lives in
 * the repository, and each lights up the moment its body is written.
 *
 * The alternative, publishing seven cards that link to six empty pages, is
 * the exact failure the old site had: a blog with categories called "Fitness
 * Zone" and no reason to exist. Doc 08 W5-11 is explicit that a post carries
 * an answer block and at least one related link before it can publish.
 *
 * TODO(W5-11): move to `web_posts` with the taxonomy from doc 06 §8, so the
 * client writes these in the Content Studio rather than in TypeScript.
 */

export const INSIGHT_CATEGORIES = [
  "For landlords",
  "Renting",
  "Buying",
  "Market notes",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

/**
 * A block of article body.
 *
 * A small union rather than raw HTML or markdown: it keeps the prose free of
 * markup the client could break, and it means every article renders with the
 * same measure, the same heading scale and the same checklist treatment
 * without anyone remembering to apply them.
 */
export type ArticleBlock =
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "compare"; items: { title: string; body: string }[] }
  | { kind: "checklist"; items: string[] };

export type InsightPost = {
  slug: string;
  title: string;
  summary: string;
  category: InsightCategory;
  /** ISO date, rendered in mono. */
  date: string;
  readingMinutes: number;
  author: string;
  /** Breadcrumb leaf, shorter than the title. */
  crumb: string;
  featured?: boolean;
  /** Absent means unwritten, and the post does not appear on the site. */
  body?: ArticleBlock[];
  /** Closing panel. Matched to the subject, per doc 04 §9. */
  cta?: { title: string; body: string; primary: { label: string; href: string } };
};

export const INSIGHT_POSTS: InsightPost[] = [
  {
    slug: "what-a-management-agreement-should-say",
    title: "What a management agreement should actually say",
    summary:
      "Most disputes between owners and agents trace back to four clauses that were never agreed properly: the fee basis, the repair approval threshold, who holds the deposit, and how the mandate ends.",
    category: "For landlords",
    date: "2026-07-14",
    readingMinutes: 6,
    author: "Paul Amos",
    crumb: "Management agreements",
    featured: true,
    body: [
      {
        kind: "lead",
        text: "Almost every argument we have seen between a Nairobi landlord and their agent comes down to something that was never written down properly. Not fraud, usually. Ambiguity.",
      },
      {
        kind: "p",
        text: "A management agreement is a short document. If yours runs to fourteen pages, most of it is boilerplate protecting the agent. The four clauses below are the ones that decide how the relationship actually goes, and they should be legible without a lawyer.",
      },
      { kind: "h2", text: "1. What the fee is charged on" },
      {
        kind: "p",
        text: "“Eight percent” is not a term. Eight percent of what, and when? The two common bases produce very different outcomes:",
      },
      {
        kind: "compare",
        items: [
          {
            title: "Of rent collected",
            body: "The agent earns when money actually arrives, so chasing arrears is in their interest. This is the basis to insist on.",
          },
          {
            title: "Of rent invoiced or of gross potential",
            body: "The agent is paid whether or not the tenant pays, and on empty units. It quietly transfers the cost of poor collection onto you.",
          },
        ],
      },
      {
        kind: "p",
        text: "Also check whether the fee is charged on the service charge as well as rent. It should not be. Service charge is not your income.",
      },
      { kind: "h2", text: "2. The repair approval threshold" },
      {
        kind: "p",
        text: "A manager needs the authority to fix a burst pipe at eleven at night without a phone call. They do not need the authority to repaint a whole block and bill you afterwards. So the agreement should name a figure, and both behaviours either side of it.",
      },
      {
        kind: "quote",
        text: "Ours is set with the owner, usually between KES 10,000 and 20,000 per job. Below it we act and attach the invoice. Above it, nothing happens without your written yes, and you get the quotes.",
      },
      {
        kind: "p",
        text: "Ask one more question: does the agent take a margin on repairs? Some add fifteen percent to every contractor invoice. That is not illegal, but it should be disclosed in the fee clause rather than discovered in month four.",
      },
      { kind: "h2", text: "3. Who holds the deposit, and where" },
      {
        kind: "p",
        text: "Tenant deposits are not the agent's money and should not sit in the agent's operating account. The clause should say the deposit is held in a separate client account, that it appears on your statement, and what happens to it at the end of the tenancy.",
      },
      {
        kind: "p",
        text: "The related question is the handover inspection. Without a dated, photographed record of condition at move-in, a deposit deduction at move-out is an argument you will usually lose. Insist that inspection reports are filed and shared with you, not just held on someone's phone.",
      },
      { kind: "h2", text: "4. How it ends" },
      {
        kind: "p",
        text: "The exit clause tells you more about an agent than the fee does. Look for three things: a notice period you can live with, no penalty for leaving, and an obligation to hand over tenant files, leases, deposit balances and arrears records within a stated number of days.",
      },
      {
        kind: "p",
        text: "Watch for clauses that survive termination, particularly one that entitles the agent to a commission if your tenant later renews or buys the property. A twelve month tail on a relationship you have ended is a trap.",
      },
      { kind: "h2", text: "A short checklist" },
      {
        kind: "checklist",
        items: [
          "Fee charged on rent collected, not invoiced, and not on service charge",
          "A named repair threshold, and disclosure of any margin on contractor invoices",
          "Deposits in a separate client account, shown on your statement",
          "Dated, photographed inspection reports at move-in and move-out",
          "A statement date you can rely on, and a named person to call",
          "Clean exit: reasonable notice, no penalty, full handover of records",
        ],
      },
      {
        kind: "p",
        text: "If an agent will not put these in writing, that is the answer.",
      },
    ],
    cta: {
      title: "Want a second opinion on yours?",
      body: "Send us the agreement you have been given. We will tell you which of these four clauses is missing, whether or not you move to us.",
      primary: { label: "Talk to us about management", href: "/landlords#valuation" },
    },
  },

  // ── Planned. Held until each body is written. ──────────────────────────────
  {
    slug: "what-a-two-bedroom-in-kilimani-costs",
    title: "What a two bedroom in Kilimani costs, and why",
    summary:
      "Rent is only part of it. Service charge, water and parking are where two similar blocks separate.",
    category: "Renting",
    date: "2026-06-28",
    readingMinutes: 4,
    author: "Judy Wacera",
    crumb: "Kilimani rents",
  },
  {
    slug: "checking-a-title-before-you-pay",
    title: "Checking a title before you pay a deposit",
    summary:
      "The searches to run, what a clean title looks like, and the three red flags worth walking away from.",
    category: "Buying",
    date: "2026-06-02",
    readingMinutes: 7,
    author: "Paul Amos",
    crumb: "Title checks",
  },
  {
    slug: "service-charge-what-it-should-cover",
    title: "Service charge: what it should cover, and what it should not",
    summary:
      "How to read a service charge schedule, and the items owners are quietly billed for twice.",
    category: "For landlords",
    date: "2026-05-11",
    readingMinutes: 5,
    author: "Lewis Maina",
    crumb: "Service charge",
  },
  {
    slug: "buying-land-in-ruiru-and-tatu-city",
    title: "Buying land in Ruiru and Tatu City: the questions that matter",
    summary:
      "Beacons, access roads, change of use and the difference a serviced plot actually buys you.",
    category: "Buying",
    date: "2026-04-19",
    readingMinutes: 6,
    author: "Paul Amos",
    crumb: "Buying land",
  },
  {
    slug: "questions-before-you-sign-in-a-new-block",
    title: "Questions to ask before you sign in a new block",
    summary:
      "Water storage, generator coverage, parking per unit, and who to call when the lift fails.",
    category: "Renting",
    date: "2026-04-02",
    readingMinutes: 5,
    author: "Judy Wacera",
    crumb: "New blocks",
  },
  {
    slug: "office-rents-outside-the-cbd",
    title: "Office rents outside the CBD: where the demand actually went",
    summary:
      "Upper Hill, Westlands and Tatu City compared on rent per square foot and total occupancy cost.",
    category: "Market notes",
    date: "2026-03-08",
    readingMinutes: 8,
    author: "Paul Amos",
    crumb: "Office rents",
  },
];

/** Only articles with a body exist as far as the site is concerned. */
export function publishedPosts(): InsightPost[] {
  return INSIGHT_POSTS.filter((post) => post.body && post.body.length > 0).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function findPost(slug: string): InsightPost | undefined {
  const post = INSIGHT_POSTS.find((item) => item.slug === slug);
  return post?.body && post.body.length > 0 ? post : undefined;
}

export const INSIGHTS_HERO = {
  eyebrow: "Insights",
  headline: "Worth reading before you sign anything.",
  lead: "Practical writing on Nairobi property from the people managing it: what things cost, what the paperwork should say, and where owners and tenants get caught out.",
} as const;

export const INSIGHTS_NEWSLETTER = {
  title: "One email a month",
  body: "New listings before they go on the portals, plus whatever we published. No forwarding your address to anyone, and one click to stop.",
  submitLabel: "Subscribe",
} as const;
