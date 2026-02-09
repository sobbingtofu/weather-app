import "./../shared/style/globals.css";
import {Inter} from "next/font/google";
import {ReactQueryProvider} from "@/shared/lib/providers/query-client-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "A Simple Weather App",
  description: "날씨 정보를 제공하는 심플한 웹 애플리케이션",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
