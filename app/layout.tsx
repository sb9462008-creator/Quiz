import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMAI — Цахим Сүлжээний Хамаарлын Тест',
  description: 'FOMO, SMAS-2, Анхаарал хяналт зэрэг 3 хэмжигдэхүүнийг хамарсан иж бүрэн үнэлгээ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
