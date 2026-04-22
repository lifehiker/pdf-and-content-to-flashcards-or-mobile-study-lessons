import SeoPage from "@/components/seo-page";
import { blogPages } from "@/lib/content";

export const metadata = {
  title: "How to Turn Lecture Slides Into Flashcards | Syllabus",
  description: blogPages["how-to-turn-lecture-slides-into-flashcards"].description,
};

export default function Page() {
  return <SeoPage page={blogPages["how-to-turn-lecture-slides-into-flashcards"]} article />;
}
