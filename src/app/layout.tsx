import type {Metadata} from "next";
import "./../shared/style/globals.css";

export const metadata: Metadata = {
  title: "Weather App",
  description: "A simple weather application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
