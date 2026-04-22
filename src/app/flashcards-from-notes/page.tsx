import SeoPage from "@/components/seo-page";
import { marketingPages } from "@/lib/content";

export const metadata = {
  title: "Flashcards From Notes | Make Study Cards From Class Notes | Syllabus",
  description: marketingPages["flashcards-from-notes"].description,
};

export default function Page() {
  return <SeoPage page={marketingPages["flashcards-from-notes"]} />;
}
