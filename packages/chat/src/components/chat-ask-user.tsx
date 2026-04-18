"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  MessageSquareMore,
  PenLine,
  Send,
  SkipForward,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AskUserQuestion {
  id: string;
  question: string;
  header?: string;
  options?: { label: string; description?: string }[];
  multiple?: boolean;
  custom?: boolean;
}

type StepStatus = "answered" | "empty";

export interface ChatAskUserProps {
  /** The pending tool call arguments — expects { questions: AskUserQuestion[] } */
  questions: AskUserQuestion[];
  /** Called when the user submits answers */
  onSubmit: (answers: { questionId: string; selected: string[] }[]) => void;
  /** Whether the panel is disabled (e.g. already submitted) */
  disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Button helpers (self-contained, no external UI dep)                */
/* ------------------------------------------------------------------ */

function Btn({
  children,
  variant = "default",
  disabled,
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "ghost" | "outline" | "accent";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = "px-3 py-1.5 text-xs";
  const variants = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    ghost: "bg-transparent hover:bg-accent text-muted-foreground",
    outline: "border border-border bg-transparent hover:bg-muted/50 text-foreground",
    accent: "bg-primary text-primary-foreground hover:bg-primary/90",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Question Card                                                      */
/* ------------------------------------------------------------------ */

function QuestionCard({
  q,
  sel,
  customText,
  disabled,
  submitting,
  onToggle,
  onCustomChange,
  onEnterSubmit,
}: {
  q: AskUserQuestion;
  sel: Set<string>;
  customText: string;
  disabled?: boolean;
  submitting: boolean;
  onToggle: (label: string, multiple: boolean) => void;
  onCustomChange: (text: string) => void;
  onEnterSubmit: () => void;
}) {
  const isMultiple = q.multiple ?? false;
  const showCustom = q.custom !== false;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start gap-2 mb-3">
        <MessageSquareMore className="size-4 text-primary mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          {q.header && (
            <p className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider mb-0.5">{q.header}</p>
          )}
          <p className="font-medium text-foreground">{q.question}</p>
        </div>
        {isMultiple && (
          <span className="text-[9px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 shrink-0">
            Multi-select
          </span>
        )}
      </div>

      {q.options && q.options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {q.options.map((opt) => {
            const isSelected = sel.has(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                disabled={disabled || submitting}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary font-medium shadow-sm"
                    : "border-border bg-muted/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                }`}
                onClick={() => onToggle(opt.label, isMultiple)}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isSelected && <Check className="size-2.5 text-primary-foreground" />}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.options?.some((o) => o.description) && sel.size > 0 && (
        <div className="mb-3 pl-1">
          {q.options
            ?.filter((o) => sel.has(o.label) && o.description)
            .map((o) => (
              <p key={o.label} className="text-xs text-muted-foreground leading-snug">
                <span className="font-medium text-foreground">{o.label}:</span> {o.description}
              </p>
            ))}
        </div>
      )}

      {showCustom && (
        <div className="flex items-center gap-2">
          <PenLine className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Type your own answer..."
            className="flex-1 h-8 px-3 text-sm rounded-lg border border-border bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            value={customText}
            disabled={disabled || submitting}
            onChange={(e) => onCustomChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onEnterSubmit();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Warning banner                                                     */
/* ------------------------------------------------------------------ */

function WarningBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700">
      <AlertTriangle className="size-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ChatAskUser({ questions, onSubmit, disabled }: ChatAskUserProps) {
  const [selections, setSelections] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    for (const q of questions) init[q.id] = new Set();
    return init;
  });
  const [customTexts, setCustomTexts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const q of questions) init[q.id] = "";
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [partialWarning, setPartialWarning] = useState(false);
  const [skipWarning, setSkipWarning] = useState(false);

  const isWizard = questions.length > 1;
  const isSummaryStep = isWizard && step === questions.length;
  const current = !isSummaryStep ? questions[step] : undefined;

  const toggleOption = useCallback((questionId: string, label: string, multiple: boolean) => {
    setSelections((prev) => {
      const curr = new Set(prev[questionId]);
      if (curr.has(label)) curr.delete(label);
      else {
        if (!multiple) curr.clear();
        curr.add(label);
      }
      return { ...prev, [questionId]: curr };
    });
  }, []);

  const getStatus = useCallback(
    (q: AskUserQuestion): StepStatus => {
      const sel = selections[q.id];
      const txt = customTexts[q.id]?.trim();
      return (sel && sel.size > 0) || (txt && txt.length > 0) ? "answered" : "empty";
    },
    [selections, customTexts],
  );

  const statuses = questions.map(getStatus);
  const answeredCount = statuses.filter((s) => s === "answered").length;
  const emptyCount = statuses.filter((s) => s === "empty").length;
  const allAnswered = emptyCount === 0;
  const hasAnyAnswer = answeredCount > 0;

  // Auto-navigate to summary when all answered
  const prevAllAnswered = useRef(false);
  useEffect(() => {
    if (isWizard && allAnswered && !prevAllAnswered.current && !isSummaryStep) setStep(questions.length);
    prevAllAnswered.current = allAnswered;
  }, [allAnswered, isWizard, isSummaryStep, questions.length]);

  useEffect(() => {
    if (!isSummaryStep) setPartialWarning(false);
  }, [isSummaryStep]);
  useEffect(() => {
    setSkipWarning(false);
  }, [step]);

  const buildAnswers = useCallback(() => {
    return questions.map((q) => {
      const selected = Array.from(selections[q.id] ?? []);
      const custom = customTexts[q.id]?.trim();
      if (custom && !selected.includes(custom)) selected.push(custom);
      return { questionId: q.id, selected };
    });
  }, [questions, selections, customTexts]);

  const handleSubmit = useCallback(() => {
    if (submitting || disabled) return;
    if (emptyCount > 0 && !partialWarning) {
      setPartialWarning(true);
      return;
    }
    if (!hasAnyAnswer) return;
    setSubmitting(true);
    setPartialWarning(false);
    onSubmit(buildAnswers());
  }, [submitting, disabled, emptyCount, partialWarning, hasAnyAnswer, buildAnswers, onSubmit]);

  const handleSkip = useCallback(() => {
    if (submitting || disabled) return;
    if (!skipWarning) {
      setSkipWarning(true);
      return;
    }
    setSubmitting(true);
    setSkipWarning(false);
    const answers = questions.map((q) => ({ questionId: q.id, selected: [] as string[] }));
    onSubmit(answers);
  }, [submitting, disabled, skipWarning, questions, onSubmit]);

  const advanceStep = useCallback(() => {
    const nextEmpty = questions.findIndex((q, i) => i > step && getStatus(q) === "empty");
    setStep(nextEmpty >= 0 ? nextEmpty : questions.length);
  }, [questions, step, getStatus]);

  // ── Single question — flat layout ──
  if (!isWizard) {
    return (
      <div className="space-y-3">
        <QuestionCard
          q={questions[0]}
          sel={selections[questions[0].id] ?? new Set()}
          customText={customTexts[questions[0].id] ?? ""}
          disabled={disabled}
          submitting={submitting}
          onToggle={(label, multiple) => toggleOption(questions[0].id, label, multiple)}
          onCustomChange={(text) => setCustomTexts((prev) => ({ ...prev, [questions[0].id]: text }))}
          onEnterSubmit={() => {
            if (hasAnyAnswer) handleSubmit();
          }}
        />
        <div className="flex justify-end">
          <Btn variant="accent" disabled={!hasAnyAnswer || submitting} onClick={handleSubmit} className="gap-1.5">
            {submitting ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                Send answer
              </>
            )}
          </Btn>
        </div>
      </div>
    );
  }

  // ── Wizard layout ──
  return (
    <div>
      {/* Horizontal tabs */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const status = statuses[idx];
          const isActive = idx === step;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setStep(idx)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-primary/5 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              <span
                className={`size-2 rounded-full shrink-0 ${
                  status === "answered" ? "bg-green-500" : isActive ? "bg-primary" : "bg-accent"
                }`}
              />
              {q.header || `Q${idx + 1}`}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setStep(questions.length)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
            isSummaryStep
              ? "bg-primary/5 text-primary border border-primary/20"
              : "text-muted-foreground hover:bg-muted/50 border border-transparent"
          }`}
        >
          <ListChecks className="size-3" />
          Summary
        </button>
      </div>

      {/* Summary step */}
      {isSummaryStep ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Summary</p>
              <span className="text-[9px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-auto">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const status = statuses[idx];
                const sel = selections[q.id];
                const txt = customTexts[q.id]?.trim();
                const answer =
                  status === "answered"
                    ? [...(sel?.size ? Array.from(sel) : []), ...(txt ? [txt] : [])].join(", ")
                    : undefined;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setStep(idx)}
                    className="flex items-start gap-2 w-full text-left rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <span
                      className={`size-2 rounded-full shrink-0 mt-1.5 ${
                        status === "answered" ? "bg-green-500" : "bg-accent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{q.question}</p>
                      {answer ? (
                        <p className="text-xs text-muted-foreground truncate">{answer}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Not answered yet</p>
                      )}
                    </div>
                    <ChevronRight className="size-3 text-muted-foreground mt-1 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {partialWarning && (
            <WarningBanner>
              {emptyCount} question{emptyCount > 1 ? "s" : ""} not answered. Press send again to confirm.
            </WarningBanner>
          )}
          {skipWarning && (
            <WarningBanner>Skip all questions without answering? Press skip again to confirm.</WarningBanner>
          )}

          <div className="flex items-center justify-between pt-1">
            <Btn variant="ghost" onClick={() => setStep(questions.length - 1)} className="gap-1">
              <ChevronLeft className="size-3.5" />
              Back
            </Btn>
            <div className="flex items-center gap-2">
              {!allAnswered && (
                <Btn variant="ghost" disabled={submitting} onClick={handleSkip} className="gap-1">
                  <SkipForward className="size-3.5" />
                  {skipWarning ? "Confirm skip" : "Skip all"}
                </Btn>
              )}
              <Btn variant="accent" disabled={!hasAnyAnswer || submitting} onClick={handleSubmit} className="gap-1.5">
                {submitting ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Send answers
                  </>
                )}
              </Btn>
            </div>
          </div>
        </div>
      ) : current ? (
        <>
          <QuestionCard
            q={current}
            sel={selections[current.id] ?? new Set()}
            customText={customTexts[current.id] ?? ""}
            disabled={disabled}
            submitting={submitting}
            onToggle={(label, multiple) => toggleOption(current.id, label, multiple)}
            onCustomChange={(text) => setCustomTexts((prev) => ({ ...prev, [current.id]: text }))}
            onEnterSubmit={advanceStep}
          />

          {skipWarning && (
            <div className="mt-3">
              <WarningBanner>Skip all questions without answering? Press skip again to confirm.</WarningBanner>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <Btn variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)} className="gap-1">
              <ChevronLeft className="size-3.5" />
              Back
            </Btn>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" disabled={submitting} onClick={handleSkip} className="gap-1">
                <SkipForward className="size-3.5" />
                {skipWarning ? "Confirm skip" : "Skip all"}
              </Btn>
              <Btn
                variant={getStatus(current) === "answered" ? "default" : "outline"}
                onClick={() => {
                  setSkipWarning(false);
                  advanceStep();
                }}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Btn>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
