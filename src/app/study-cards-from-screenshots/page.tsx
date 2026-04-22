import SeoPage from "@/components/seo-page";
import { marketingPages } from "@/lib/content";

export const metadata = {
  title: "Study Cards From Screenshots | Convert Notes Photos | Syllabus",
  description: marketingPages["study-cards-from-screenshots"].description,
};

export default function Page() {
  return <SeoPage page={marketingPages["study-cards-from-screenshots"]} />;
}
