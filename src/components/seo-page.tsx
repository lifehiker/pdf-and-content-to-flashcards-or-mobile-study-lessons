import Link from "next/link";
import { brand, type MarketingPage } from "@/lib/content";

type SeoPageProps = {
  page: MarketingPage;
  article?: boolean;
};

export default function SeoPage({ page, article = false }: SeoPageProps) {
  return (
    <main className="site-shell seo-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand-mark" href="/">
          <span className="brand-glyph">S</span>
          {brand}
        </Link>
        <div className="nav-links">
          <Link href="/pdf-to-flashcards">PDF</Link>
          <Link href="/flashcards-from-notes">Notes</Link>
          <Link href="/study-cards-from-screenshots">Screenshots</Link>
          <Link href="/anki-alternative">Anki alternative</Link>
        </div>
      </nav>

      <section className="seo-hero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="hero-copy">{page.description}</p>
          <Link className="primary-action" href="/">
            {page.cta}
          </Link>
        </div>
        <aside className="source-sheet" aria-label="Example generated output">
          <div className="sheet-tag">Generated deck</div>
          <div className="mini-card tilted">
            <span>Front</span>
            <strong>What does active recall measure?</strong>
          </div>
          <div className="mini-card">
            <span>Back</span>
            <p>Whether you can retrieve the idea without seeing the source page.</p>
          </div>
          <div className="queue-strip">
            <span>Again</span>
            <span>Good</span>
            <span>Easy</span>
          </div>
        </aside>
      </section>

      <section className="proof-grid" aria-label="Feature proof points">
        {page.proof.map((item) => (
          <div className="proof-cell" key={item}>
            <span />
            {item}
          </div>
        ))}
      </section>

      <section className="essay-band">
        <p className="eyebrow">{article ? "Field notes" : "Workflow"}</p>
        <h2>Document in, study surface out.</h2>
        <p>
          {brand} is designed for students who already have the material and need a faster path to recall.
          The import flow accepts PDFs, pasted notes, and image sources, then produces editable cards, a
          short lesson sequence, and a due queue that works on phone or desktop.
        </p>
        <p>
          The result is intentionally narrow: fewer menus, clearer limits, and an editor that treats AI output
          as a first draft. You can delete weak cards, rewrite the back side, add missing prompts, archive decks,
          and keep reviewing without learning a complex flashcard system.
        </p>
        <Link className="secondary-action" href="/">
          Open the product demo
        </Link>
      </section>
    </main>
  );
}
