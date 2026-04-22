import SeoPage from "@/components/seo-page";
import { marketingPages } from "@/lib/content";

export const metadata = {
  title: "Quizlet Alternative for PDF Import | Document In, Deck Out | Syllabus",
  description: marketingPages["quizlet-alternative-for-pdf-import"].description,
};

export default function Page() {
  return <SeoPage page={marketingPages["quizlet-alternative-for-pdf-import"]} />;
}
