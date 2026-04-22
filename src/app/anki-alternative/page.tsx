import SeoPage from "@/components/seo-page";
import { marketingPages } from "@/lib/content";

export const metadata = {
  title: "Anki Alternative Mobile | Spaced Repetition With No Setup | Syllabus",
  description: marketingPages["anki-alternative"].description,
};

export default function Page() {
  return <SeoPage page={marketingPages["anki-alternative"]} />;
}
