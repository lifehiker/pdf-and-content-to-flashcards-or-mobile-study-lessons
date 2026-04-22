import SeoPage from "@/components/seo-page";
import { blogPages } from "@/lib/content";

export const metadata = {
  title: "Best Way to Study From PDFs | Syllabus",
  description: blogPages["best-way-to-study-from-pdfs"].description,
};

export default function Page() {
  return <SeoPage page={blogPages["best-way-to-study-from-pdfs"]} article />;
}
