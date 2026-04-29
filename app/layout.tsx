import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, Tangerine } from "next/font/google";
import ConfigureAmplifyClientSide from "./components/ConfigureAmplifyClientSide/ConfigureAmplifyClientSide";
import '@aws-amplify/ui-react/styles.css';
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const tangerine = Tangerine({
   subsets: ["latin"],                                                                   
   weight: "400",
   variable: "--font-tangerine",
})

const currentEnv = process.env.NEXT_PUBLIC_ENV;
const isDevEnv = currentEnv === "dev";

export const metadata: Metadata = {
    title: "Marco Valeri",
    description: "Scopri le mie esperienze, i miei viaggi e le mie storie. Articoli sui miei viaggi e la vita quotidiana",
    icons: {
        icon: "/images/marco-valeri-net-logo.jpg"
    },
    robots: {
        index: !isDevEnv,
        follow: !isDevEnv,
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {!isDevEnv && (
          <>
            <Script
              id="Cookiebot"
              src="https://consent.cookiebot.com/uc.js"
              data-cbid="19ec825f-7712-48b2-a537-07c189e5406f"
              data-blockingmode="auto"
              type="text/javascript"
              strategy="beforeInteractive"
            />
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-Y5V630M9K0"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Y5V630M9K0');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${tangerine.variable} antialiased`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
