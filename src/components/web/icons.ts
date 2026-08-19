/**
 * Icon map for the public site.
 *
 * The Claude Design files ship their own 43 glyph set as `icons.js`, mounted
 * as a `<sun-icon name size>` web component in shadow DOM. We do not port it.
 * Web doc 03 §4 mandates Tabler exclusively, `@tabler/icons-react` is already
 * a dependency shared with the ERP, and a second icon set would mean the
 * dashboard and the site drew the same concept two different ways.
 *
 * This module is the translation layer: every `sun-icon` name used across the
 * design templates, paired with its Tabler equivalent. Anyone comparing a
 * design file to the built page can read the mapping here rather than guess.
 *
 * Usage rules, from doc 03 §4 and the design system §08 amendment:
 * - 1.5 stroke on a 24px grid, inheriting `currentColor`
 * - 20px default, 16px inline with text, 24px feature
 * - decorative icons carry `aria-hidden`, meaningful ones a label
 * - as background artwork: 400 to 620px, stroke 0.4, opacity 5 to 6%, one
 *   glyph per dark band, bled off two edges, never on a light band
 */

import {
  IconAdjustmentsHorizontal,
  IconArmchair,
  IconArrowNarrowRight,
  IconArrowUpRight,
  IconBath,
  IconBed,
  IconBriefcase,
  IconBuilding,
  IconBuildingWarehouse,
  IconCar,
  IconCheck,
  IconChartHistogram,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconFileDescription,
  IconHeart,
  IconPrinter,
  IconQuote,
  IconHome,
  IconKey,
  IconLayoutGrid,
  IconList,
  IconLock,
  IconMail,
  IconMapPin,
  IconMenu2,
  IconMessageCircle,
  IconMinus,
  IconPhone,
  IconPlus,
  IconReceipt,
  IconRuler2,
  IconSearch,
  IconRefresh,
  IconShare2,
  IconShieldCheck,
  IconSparkles,
  IconTool,
  IconUser,
  IconUsers,
  IconWallet,
  IconX,
  type Icon,
} from "@tabler/icons-react";

/** Every glyph the design templates reference, by its design-file name. */
export const webIcons = {
  // Navigation and chrome
  arrow: IconArrowNarrowRight,
  arrowOut: IconArrowUpRight,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  menu: IconMenu2,
  close: IconX,
  search: IconSearch,
  plus: IconPlus,
  minus: IconMinus,
  grid: IconLayoutGrid,
  list: IconList,
  sliders: IconAdjustmentsHorizontal,

  // Property specification
  bed: IconBed,
  bath: IconBath,
  area: IconRuler2,
  parking: IconCar,
  furnished: IconArmchair,

  // Property categories
  house: IconHome,
  building: IconBuilding,
  warehouse: IconBuildingWarehouse,
  pin: IconMapPin,
  key: IconKey,

  // Services and proposition
  wallet: IconWallet,
  chart: IconChartHistogram,
  briefcase: IconBriefcase,
  receipt: IconReceipt,
  doc: IconFileDescription,
  lock: IconLock,
  sparkle: IconSparkles,

  // People and contact
  user: IconUser,
  users: IconUsers,
  phone: IconPhone,
  mail: IconMail,
  chat: IconMessageCircle,

  // Actions
  save: IconHeart,
  check: IconCheck,
  quote: IconQuote,
  share: IconShare2,
  print: IconPrinter,
  wrench: IconTool,
  sync: IconRefresh,
  shield: IconShieldCheck,
} as const satisfies Record<string, Icon>;

export type WebIconName = keyof typeof webIcons;

/** Stroke width, fixed across the site. A heavier stroke reads as a different
 *  icon family, which is exactly what one set is meant to prevent. */
export const WEB_ICON_STROKE = 1.5;

/** The three sizes doc 03 §4 permits. Anything else is a defect. */
export const WEB_ICON_SIZE = {
  inline: 16,
  default: 20,
  feature: 24,
} as const;
