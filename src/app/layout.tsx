import "./globals.css";
import type { Metadata } from "next";
import { Cardo, Cormorant_Garamond, JetBrains_Mono, Nunito } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

// Terrain Web editorial serif. The ERP uses Cardo (--font-cardo) for its
// .title-serif and .hero-numeral; the public site uses Cormorant Garamond,
// which every web doc and every design file specifies. Both load: they are
// different surfaces of one product and neither should borrow the other
// display face. Weight 600 carries display and section titles per the design
// system section 08 amendment, 500 card and tile titles, 300 the wordmark
// and pull quotes.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sunland ERP",
  description: "Internal Real Estate ERP for Sunland Real Estates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${jetbrains.variable} ${cardo.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
