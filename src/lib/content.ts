export type MarketingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  proof: string[];
  cta: string;
};

export const brand = "Syllabus";

export const marketingPages: Record<string, MarketingPage> = {
  "pdf-to-flashcards": {
    slug: "pdf-to-flashcards",
    eyebrow: "PDF to flashcards",
    title: "Turn dense PDFs into a clean review deck before your coffee cools.",
    description:
      "Upload textbook chapters, lecture slides, or journal packets and get editable question-answer cards with a due queue built for mobile review.",
    proof: ["Text-based PDF extraction", "Auto-titled decks", "Editable generated cards", "Again, Good, Easy review"],
    cta: "Convert a PDF",
  },
  "flashcards-from-notes": {
    slug: "flashcards-from-notes",
    eyebrow: "Flashcards from notes",
    title: "Paste rough notes. Get a study deck with the noise stripped out.",
    description:
      "Syllabus turns pasted class notes into focused cards and pocket lessons, keeping the original context nearby while you edit.",
    proof: ["Paste notes directly", "Chunked concept detection", "Manual card add", "Lesson summaries"],
    cta: "Paste notes",
  },
  "study-cards-from-screenshots": {
    slug: "study-cards-from-screenshots",
    eyebrow: "Study cards from screenshots",
    title: "Screenshots, board photos, and slide grabs become study prompts.",
    description:
      "Drop images from lectures or handwritten notes into the import lane, then review the extracted ideas as flashcards or lesson cards.",
    proof: ["Image import lane", "OCR-ready workflow", "Screenshot source tracking", "Mobile-first lessons"],
    cta: "Upload screenshots",
  },
  "anki-alternative": {
    slug: "anki-alternative",
    eyebrow: "Anki alternative",
    title: "Spaced repetition without turning setup into a second course.",
    description:
      "Syllabus keeps the power move from Anki, the review loop, and removes the intimidating deck-building ritual.",
    proof: ["No template setup", "3-button review", "Generated deck starter", "Export-ready structure"],
    cta: "Try the workflow",
  },
  "quizlet-alternative-for-pdf-import": {
    slug: "quizlet-alternative-for-pdf-import",
    eyebrow: "Quizlet alternative for PDF import",
    title: "Built around importing source material, not browsing a study platform.",
    description:
      "A narrow workflow for students who already have the PDF, notes, or screenshots and need a deck that is ready to refine.",
    proof: ["Source-first import", "Low-clutter editing", "Usage limits visible", "Deck archive controls"],
    cta: "Build a deck",
  },
};

export const blogPages: Record<string, MarketingPage> = {
  "how-to-turn-lecture-slides-into-flashcards": {
    slug: "how-to-turn-lecture-slides-into-flashcards",
    eyebrow: "Guide",
    title: "How to turn lecture slides into flashcards without copying every bullet.",
    description:
      "Start with section headers, turn diagrams into prompts, and review the result in short daily queues instead of rereading the deck.",
    proof: ["Import the file", "Cull weak cards", "Add image-heavy topics manually", "Review the same day"],
    cta: "Make slide cards",
  },
  "best-way-to-study-from-pdfs": {
    slug: "best-way-to-study-from-pdfs",
    eyebrow: "Study method",
    title: "The best way to study from PDFs is to stop treating them like novels.",
    description:
      "Extract the testable ideas, convert them into recall prompts, then keep the PDF as reference instead of your main review surface.",
    proof: ["Skim for structure", "Generate recall prompts", "Edit for precision", "Repeat due cards"],
    cta: "Convert a PDF",
  },
  "anki-vs-quizlet-vs-stackcards": {
    slug: "anki-vs-quizlet-vs-stackcards",
    eyebrow: "Comparison",
    title: "Anki vs Quizlet vs Syllabus: choose based on how your material starts.",
    description:
      "Anki rewards power users, Quizlet rewards browsing and sharing, and Syllabus focuses on document-to-deck creation.",
    proof: ["Anki: maximum control", "Quizlet: broad study sets", "Syllabus: import-first workflow", "Best fit: busy students"],
    cta: "Compare in the app",
  },
};
