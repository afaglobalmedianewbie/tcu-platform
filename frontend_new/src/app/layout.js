import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://topclassuniversal.co.id"),
  title: {
    default: "TCU Platform - PT Top Class Universal",
    template: "%s | TCU Platform"
  },
  description: "Provider Internet Fiber Optic terpercaya melayani Pangandaran, Banjar, Ciamis, Tasikmalaya, dan Indramayu. Solusi internet rumah & bisnis super cepat dan stabil dengan SLA tinggi.",
  keywords: ["internet fiber", "wifi murah", "dedicated internet", "isp terbaik", "tcu platform", "top class universal", "pangandaran", "banjar", "ciamis", "tasikmalaya", "indramayu"],
  authors: [{ name: "PT Top Class Universal" }],
  creator: "PT Top Class Universal",
  publisher: "PT Top Class Universal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "TCU Platform - PT Top Class Universal",
    description: "Provider Internet Fiber Optic terpercaya dengan koneksi super cepat, stabil, dan layanan bantuan 24/7.",
    url: "https://topclassuniversal.co.id",
    siteName: "TCU Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TCU Platform - Internet Fiber Optik Cepat & Stabil",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCU Platform - PT Top Class Universal",
    description: "Nikmati internet fiber optic cepat dan stabil dari TCU Platform.",
    images: ["/og-image.jpg"],
  },
};

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
