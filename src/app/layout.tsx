import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF to Flashcards | Turn Notes Into Study Cards Fast | Syllabus",
  description:
    "Convert PDFs, slides, notes, and screenshots into editable flashcards and bite-sized study lessons. Review with spaced repetition on mobile or desktop.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
