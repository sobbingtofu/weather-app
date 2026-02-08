import "./../shared/style/globals.css";
import {Inter} from "next/font/google";
import {ReactQueryProvider} from "@/shared/lib/providers/query-client-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "날씨 검색기",
  description: "날씨를 검색하세요",
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
