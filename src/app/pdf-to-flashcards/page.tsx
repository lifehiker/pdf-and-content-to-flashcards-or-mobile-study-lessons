import SeoPage from "@/components/seo-page";
import { marketingPages } from "@/lib/content";

export const metadata = {
  title: "PDF to Flashcards | Turn PDFs Into Study Cards Fast | Syllabus",
  description: marketingPages["pdf-to-flashcards"].description,
};

export default function Page() {
  return <SeoPage page={marketingPages["pdf-to-flashcards"]} />;
}
