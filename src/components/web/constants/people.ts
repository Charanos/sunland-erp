/**
 * One roster of who works here.
 *
 * Two parts of the site need this: the article bylines in `/insights` and the
 * team section on `/about`. Before this the portrait map lived inside
 * `insights.content.ts`, which meant About had to reach into the insights
 * module for a photograph — a coupling that would break silently the day
 * anyone reorganised the article content.
 *
 * ── On `name` vs `fullName` ──
 *
 * `name` is the byline key. It must keep matching the `author` field on every
 * post in `insights.content.ts` exactly, or the avatar and the article count on
 * the team card both silently resolve to nothing. `fullName` is the fuller form
 * as published on sunland.co.ke/our-team, used for display only. Where they are
 * the same, `fullName` is omitted.
 *
 * Roles and bios are transcribed from the live team page rather than inferred.
 * Three of these previously carried guesses — Paul Amos was listed as Managing
 * Director rather than CEO, Judy Wacera as lettings rather than administration
 * and content, Lewis Maina as property management rather than facilities and
 * marketing. Those are corrected here.
 *
 * TODO(W5-13): source from `web_team_members` joined to `users`, so a
 * consultant's photograph, title and direct line come from the ERP rather than
 * a constant that goes stale the moment someone changes desk. This module is
 * the seam that swap happens at.
 */
export type Person = {
  /** Byline key — must match `InsightPost.author` exactly. */
  name: string;
  /** As published on the live team page, where it differs from the byline. */
  fullName?: string;
  role: string;
  bio: string;
  photo: string;
  /** Published only where the person actually fields that channel. */
  contacts?: readonly ("email" | "call")[];
  /** One published line, where they have given one. */
  quote?: string;
};

export const PEOPLE: readonly Person[] = [
  {
    name: "Paul Amos",
    fullName: "Paul Amos Mwangi",
    role: "Chief Executive Officer",
    bio: "A seasoned real estate leader with expertise in property acquisition, development and investment management. Focused on creating value and building lasting relationships.",
    photo: "/images/paul-amos-mwangi.jpg",
    contacts: ["email"],
    quote:
      "True leadership is about inspiring others, making bold decisions, and leaving a lasting legacy.",
  },
  {
    name: "Stanley Cikunju",
    role: "Commercial Director",
    bio: "A finance, accounting and investment expert with international experience in business advisory and property management. His leadership has been instrumental in defining business strategies and scaling operations.",
    photo: "/images/stanely-cikunju.jpg",
  },
  {
    name: "Esther Kioni",
    role: "Board Member",
    bio: "Fifteen years in UK-based real estate and property management, bringing expertise in leadership, quality assurance and customer-focused service delivery.",
    photo: "/images/esther-kioni.jpg",
  },
  {
    name: "Stephen Mbatia",
    role: "General Manager & Head of Operations",
    bio: "Oversees strategic planning, operational efficiency and resource optimisation to ensure superior service delivery.",
    photo: "/images/stephen-mbatia.jpg",
  },
  {
    name: "Anthony Mwangi",
    role: "Head of Property Management",
    bio: "An accomplished property manager with expertise in financial performance, cost optimisation and process streamlining.",
    photo: "/images/anthony-mwangi.jpg",
  },
  {
    name: "Lewis Maina",
    role: "Head of Facility Management & Marketing",
    bio: "An expert in commercial property management, contract negotiations and tenant relations.",
    photo: "/images/lewis-maina.jpg",
    contacts: ["email", "call"],
  },
  {
    name: "Maryanne Wairimu",
    role: "Business Development Manager & Executive Assistant",
    bio: "A dynamic leader with expertise in business development, marketing and proposal execution, driving Sunland's growth strategies.",
    photo: "/images/maryanne-wairimu.jpg",
  },
  {
    name: "Anthony Mbugua",
    fullName: "CPA Anthony Mbugua Njunge",
    role: "Management Accountant",
    bio: "Responsible for financial planning, budgeting, risk analysis and investment portfolio management.",
    photo: "/images/anthony-mbugua-njunge.jpg",
  },
  {
    name: "Stephen Koigi",
    role: "Consulting Realtor",
    bio: "A seasoned real estate professional with seven years of experience, specialising in market analysis, property transactions and investment consulting.",
    photo: "/images/stephen-koigi.jpg",
  },
  {
    name: "Judy Wacera",
    role: "Administration & Content Manager",
    bio: "Drives brand growth through digital marketing and content management, while helping clients find their dream homes.",
    photo: "/images/judy-wacera.jpg",
    contacts: ["email", "call"],
  },
];

/** Name to portrait, derived so it cannot drift from `PEOPLE`. */
export const AUTHOR_AVATARS: Record<string, string> = Object.fromEntries(
  PEOPLE.map((person) => [person.name, person.photo])
);

export function getAuthorAvatar(author: string): string | undefined {
  return AUTHOR_AVATARS[author];
}
