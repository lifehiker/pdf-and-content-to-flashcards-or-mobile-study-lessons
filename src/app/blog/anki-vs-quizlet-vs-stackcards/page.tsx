import SeoPage from "@/components/seo-page";
import { blogPages } from "@/lib/content";

export const metadata = {
  title: "Anki vs Quizlet vs Syllabus | Syllabus",
  description: blogPages["anki-vs-quizlet-vs-stackcards"].description,
};

export default function Page() {
  return <SeoPage page={blogPages["anki-vs-quizlet-vs-stackcards"]} article />;
}
