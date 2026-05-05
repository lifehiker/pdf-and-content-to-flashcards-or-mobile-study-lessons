"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type SourceType = "pdf" | "image" | "notes";
type JobStatus = "idle" | "uploading" | "extracting" | "generating" | "ready";
type ReviewGrade = "again" | "good" | "easy";

type Flashcard = {
  id: string;
  front: string;
  back: string;
  due: number;
  interval: number;
};

type Lesson = {
  title: string;
  summary: string;
  bullets: string[];
};

type Deck = {
  id: string;
  title: string;
  sourceType: SourceType;
  status: JobStatus;
  createdAt: number;
  lastStudied?: number;
  archived: boolean;
  cards: Flashcard[];
  lessons: Lesson[];
};

const seedText =
  "Cellular respiration converts glucose into ATP through glycolysis, the citric acid cycle, and oxidative phosphorylation. Enzymes lower activation energy without being consumed. Feedback inhibition helps metabolic pathways regulate output when enough product exists.";

const sourceLabels: Record<SourceType, string> = {
  pdf: "PDF",
  image: "Screenshot",
  notes: "Notes",
};

const statusCopy: Record<JobStatus, string> = {
  idle: "Waiting",
  uploading: "Uploading source",
  extracting: "Extracting text",
  generating: "Writing cards",
  ready: "Ready",
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function titleFromInput(fileName: string, notes: string, sourceType: SourceType) {
  if (fileName) {
    return fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  }

  const words = notes
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 4);

  return words.length ? words.join(" ") : `${sourceLabels[sourceType]} import`;
}

function generateCards(rawText: string): Flashcard[] {
  const source = rawText.trim().length > 40 ? rawText : seedText;
  const sentences = source
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);

  const fallback = [
    ["What is the core idea in this source?", "Convert passive reading into active recall prompts."],
    ["Why does spaced repetition work?", "It schedules review near forgetting, making retrieval stronger over time."],
    ["What should you edit after generation?", "Remove vague cards and make each answer specific enough to grade."],
  ];

  const pairs = sentences.length
    ? sentences.map((sentence) => {
        const keyword = sentence.split(/\s+/).find((word) => word.length > 7) ?? "concept";
        return [`Explain ${keyword.toLowerCase()} in this material.`, sentence];
      })
    : fallback;

  return pairs.slice(0, 8).map(([front, back], index) => ({
    id: makeId("card"),
    front,
    back,
    due: Date.now() + index * 500,
    interval: 0,
  }));
}

function generateLessons(rawText: string): Lesson[] {
  const cards = generateCards(rawText).slice(0, 4);
  return cards.map((card, index) => ({
    title: `Lesson ${index + 1}: ${card.front.replace(/^Explain /, "").replace(/\.$/, "")}`,
    summary: card.back,
    bullets: [
      "Read the claim once, then hide it.",
      "Say the answer out loud before revealing the card.",
      "Mark Again if the wording still feels slippery.",
    ],
  }));
}

const initialDeck: Deck = {
  id: "demo-biology",
  title: "Metabolism lecture 04",
  sourceType: "pdf",
  status: "ready",
  createdAt: Date.now() - 1000 * 60 * 60 * 5,
  lastStudied: Date.now() - 1000 * 60 * 42,
  archived: false,
  cards: generateCards(seedText),
  lessons: generateLessons(seedText),
};

export default function StudyApp() {
  const [decks, setDecks] = useState<Deck[]>([initialDeck]);
  const [activeDeckId, setActiveDeckId] = useState(initialDeck.id);
  const [sourceType, setSourceType] = useState<SourceType>("pdf");
  const [notes, setNotes] = useState(seedText);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [activeTab, setActiveTab] = useState<"import" | "editor" | "lesson" | "review" | "billing">("import");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("syllabus-decks");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Deck[];
      if (parsed.length) {
        setDecks(parsed);
        setActiveDeckId(parsed[0].id);
      }
    } catch {
      window.localStorage.removeItem("syllabus-decks");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("syllabus-decks", JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    showToast("Google sign-in demo session active");
  }, []);

  const activeDeck = useMemo(
    () => decks.find((deck) => deck.id === activeDeckId) ?? decks[0],
    [activeDeckId, decks],
  );

  const dueCards = useMemo(
    () => activeDeck.cards.filter((card) => card.due <= Date.now()).sort((a, b) => a.due - b.due),
    [activeDeck.cards],
  );

  const visibleDecks = decks.filter((deck) => !deck.archived);
  const monthlyImports = decks.length;
  const freeLimitReached = monthlyImports >= 3;
  const reviewCard = dueCards[0] ?? activeDeck.cards[0];
  const activeLesson = activeDeck.lessons[Math.min(lessonIndex, activeDeck.lessons.length - 1)];

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (message) {
      toastTimerRef.current = setTimeout(() => setToast(""), 3500);
    }
  }

  function updateDeck(deckId: string, updater: (deck: Deck) => Deck) {
    setDecks((current) => current.map((deck) => (deck.id === deckId ? updater(deck) : deck)));
  }

  async function runImport() {
    if (freeLimitReached) {
      showToast("Free plan import cap reached. Upgrade unlocks unlimited imports.");
      setActiveTab("billing");
      return;
    }

    const nextTitle = titleFromInput(fileName, notes, sourceType);
    setStatus("uploading");
    showToast("Import started");
    await new Promise((resolve) => setTimeout(resolve, 420));
    setStatus("extracting");
    await new Promise((resolve) => setTimeout(resolve, 520));
    setStatus("generating");
    await new Promise((resolve) => setTimeout(resolve, 560));

    const deck: Deck = {
      id: makeId("deck"),
      title: nextTitle,
      sourceType,
      status: "ready",
      createdAt: Date.now(),
      archived: false,
      cards: generateCards(notes),
      lessons: generateLessons(notes),
    };
    setDecks((current) => [deck, ...current]);
    setActiveDeckId(deck.id);
    setStatus("ready");
    setActiveTab("editor");
    setLessonIndex(0);
    showToast(`Created "${deck.title}" with ${deck.cards.length} cards`);
    setNotes("");
    setFileName("");
    setTimeout(() => setStatus("idle"), 1200);
  }

  function addCard() {
    updateDeck(activeDeck.id, (deck) => ({
      ...deck,
      cards: [
        ...deck.cards,
        {
          id: makeId("card"),
          front: "New recall prompt",
          back: "Add the answer you expect yourself to retrieve.",
          due: Date.now(),
          interval: 0,
        },
      ],
    }));
    showToast("Manual card added");
  }

  function updateCard(cardId: string, field: "front" | "back", value: string) {
    updateDeck(activeDeck.id, (deck) => ({
      ...deck,
      cards: deck.cards.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)),
    }));
  }

  function deleteCard(cardId: string) {
    updateDeck(activeDeck.id, (deck) => ({
      ...deck,
      cards: deck.cards.filter((card) => card.id !== cardId),
    }));
    showToast("Card removed");
  }

  function regenerateCard(cardId: string) {
    updateDeck(activeDeck.id, (deck) => ({
      ...deck,
      cards: deck.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              front: `What should you remember about ${deck.title.toLowerCase()}?`,
              back: "A good card asks for one testable idea and gives a precise answer.",
            }
          : card,
      ),
    }));
    showToast("Card regenerated");
  }

  function gradeCard(grade: ReviewGrade) {
    if (!reviewCard) return;
    const minutes = grade === "again" ? 2 : grade === "good" ? 60 * 24 : 60 * 24 * 4;
    updateDeck(activeDeck.id, (deck) => ({
      ...deck,
      lastStudied: Date.now(),
      cards: deck.cards.map((card) =>
        card.id === reviewCard.id
          ? {
              ...card,
              due: Date.now() + minutes * 60 * 1000,
              interval: minutes,
            }
          : card,
      ),
    }));
    setFlipped(false);
    showToast(`Marked ${grade}`);
  }

  function archiveDeck(deckId: string) {
    updateDeck(deckId, (deck) => ({ ...deck, archived: true }));
    const nextDeck = decks.find((deck) => deck.id !== deckId && !deck.archived);
    if (nextDeck) setActiveDeckId(nextDeck.id);
    showToast("Deck archived");
  }

  function deleteDeck(deckId: string) {
    const remaining = decks.filter((deck) => deck.id !== deckId);
    setDecks(remaining.length ? remaining : [initialDeck]);
    setActiveDeckId((remaining[0] ?? initialDeck).id);
    showToast("Deck deleted");
  }

  return (
    <main className="site-shell app-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="brand-mark" href="/">
          <span className="brand-glyph">S</span>
          Syllabus
        </Link>
        <div className="nav-links">
          <Link href="/pdf-to-flashcards">PDF</Link>
          <Link href="/flashcards-from-notes">Notes</Link>
          <Link href="/study-cards-from-screenshots">Screenshots</Link>
          <Link href="/anki-alternative">Anki alternative</Link>
        </div>
        <button className="ghost-button" onClick={() => showToast("OAuth is wired as a production credential task")}>
          Sign in with Google
        </button>
      </nav>

      <section className="product-hero" aria-label="Study app workspace">
        <div className="hero-panel">
          <p className="eyebrow">Document in, deck out</p>
          <h1>Build review cards from class material, then study them before momentum leaks away.</h1>
          <p className="hero-copy">
            Upload PDFs or screenshots, paste notes, edit generated cards, swipe through lessons, and run a simple
            spaced repetition queue from one focused workspace.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => setActiveTab("import")}>
              Start import
            </button>
            <button className="secondary-action" onClick={() => setActiveTab("review")}>
              Review due cards
            </button>
          </div>
        </div>
        <div className="deck-stack" aria-hidden="true">
          <div className="floating-card one">What happens during oxidative phosphorylation?</div>
          <div className="floating-card two">ATP synthase uses a proton gradient to produce ATP.</div>
          <div className="floating-card three">Due today: {dueCards.length}</div>
        </div>
      </section>

      <section className="workspace">
        <aside className="deck-rail" aria-label="Deck management">
          <div className="rail-header">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h2>Decks</h2>
            </div>
            <span className="limit-pill">{monthlyImports}/3 free imports</span>
          </div>
          <div className="deck-list">
            {visibleDecks.map((deck) => (
              <button
                className={`deck-row ${deck.id === activeDeck.id ? "active" : ""}`}
                key={deck.id}
                onClick={() => setActiveDeckId(deck.id)}
              >
                <span className="source-dot">{sourceLabels[deck.sourceType]}</span>
                <strong>{deck.title}</strong>
                <small>
                  {deck.cards.length} cards • {deck.lastStudied ? "studied today" : "not studied"}
                </small>
              </button>
            ))}
          </div>
          <div className="deck-controls">
            <button onClick={() => archiveDeck(activeDeck.id)}>Archive</button>
            <button onClick={() => deleteDeck(activeDeck.id)}>Delete</button>
          </div>
        </aside>

        <div className="studio">
          <div className="tab-row" role="tablist" aria-label="Workspace sections">
            {(["import", "editor", "lesson", "review", "billing"] as const).map((tab) => (
              <button
                className={activeTab === tab ? "selected" : ""}
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "import" && (
            <section className="studio-panel import-grid">
              <div>
                <p className="eyebrow">Import source</p>
                <h2>Create a deck</h2>
                <div className="segmented">
                  {(["pdf", "image", "notes"] as const).map((type) => (
                    <button
                      className={sourceType === type ? "selected" : ""}
                      key={type}
                      onClick={() => setSourceType(type)}
                    >
                      {sourceLabels[type]}
                    </button>
                  ))}
                </div>
                <label className="field-label" htmlFor="source-file">
                  PDF or image source
                </label>
                <input
                  id="source-file"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? "")}
                />
                <label className="field-label" htmlFor="notes">
                  Paste notes or extracted text
                </label>
                <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
                <button className="primary-action" onClick={runImport}>
                  Generate cards and lessons
                </button>
              </div>
              <div className="process-card">
                {(["uploading", "extracting", "generating", "ready"] as JobStatus[]).map((step) => (
                  <div className={`process-step ${status === step ? "active" : ""}`} key={step}>
                    <span />
                    {statusCopy[step]}
                  </div>
                ))}
                <div className="usage-box">
                  <strong>Free plan</strong>
                  <p>3 imports/month, 25 generated cards per deck, 2 active review decks.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "editor" && (
            <section className="studio-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Flashcard editor</p>
                  <h2>{activeDeck.title}</h2>
                </div>
                <button className="secondary-action" onClick={addCard}>
                  Add card
                </button>
              </div>
              <div className="card-editor-list">
                {activeDeck.cards.map((card, index) => (
                  <article className="editor-card" key={card.id}>
                    <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                    <textarea value={card.front} onChange={(event) => updateCard(card.id, "front", event.target.value)} />
                    <textarea value={card.back} onChange={(event) => updateCard(card.id, "back", event.target.value)} />
                    <div className="editor-actions">
                      <button onClick={() => regenerateCard(card.id)}>Regenerate</button>
                      <button onClick={() => deleteCard(card.id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "lesson" && (
            <section className="studio-panel lesson-panel">
              <div>
                <p className="eyebrow">Lesson mode</p>
                <h2>{activeLesson?.title}</h2>
                <p>{activeLesson?.summary}</p>
                <ul>
                  {activeLesson?.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="lesson-actions">
                <button onClick={() => setLessonIndex((index) => Math.max(0, index - 1))}>Previous</button>
                <span>
                  {lessonIndex + 1}/{activeDeck.lessons.length}
                </span>
                <button
                  onClick={() =>
                    setLessonIndex((index) => Math.min(activeDeck.lessons.length - 1, index + 1))
                  }
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {activeTab === "review" && (
            <section className="studio-panel review-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Review queue</p>
                  <h2>{dueCards.length} due cards</h2>
                </div>
                <span className="limit-pill">Daily count {activeDeck.cards.length - dueCards.length}</span>
              </div>
              <button className={`review-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)}>
                <span>{flipped ? "Back" : "Front"}</span>
                <strong>{flipped ? reviewCard?.back : reviewCard?.front}</strong>
              </button>
              <div className="grade-row">
                <button onClick={() => gradeCard("again")}>Again</button>
                <button onClick={() => gradeCard("good")}>Good</button>
                <button onClick={() => gradeCard("easy")}>Easy</button>
              </div>
            </section>
          )}

          {activeTab === "billing" && (
            <section className="studio-panel billing-panel">
              <div>
                <p className="eyebrow">Upgrade</p>
                <h2>Pro unlocks high-volume import weeks.</h2>
                <p>
                  Unlimited imports, up to 200 cards per deck, unlimited lessons, unlimited review decks,
                  priority processing, and export-ready deck data.
                </p>
              </div>
              <div className="price-card">
                <span>Pro</span>
                <strong>$11.99</strong>
                <small>per month or $71.99 yearly</small>
                <button onClick={() => showToast("Stripe checkout needs production keys listed in HUMAN_INPUT_NEEDED.md")}>
                  Open checkout
                </button>
                <button onClick={() => showToast("Customer portal needs Stripe production keys")}>
                  Manage subscription
                </button>
              </div>
            </section>
          )}
        </div>
      </section>

      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status">
        {toast}
      </div>
    </main>
  );
}
