"use client";

import { useState } from "react";
import { ChatAskUser } from "@polpo-ai/chat";

const mockQuestions = [
  {
    id: "q1",
    question: "Which database do you want to use?",
    header: "Database",
    options: [
      { label: "PostgreSQL", description: "Recommended for production" },
      { label: "SQLite", description: "Great for development" },
      { label: "MySQL", description: "Wide compatibility" },
    ],
    custom: true,
  },
];

const mockWizardQuestions = [
  {
    id: "w1",
    question: "Which framework should I use?",
    header: "Framework",
    options: [
      { label: "Next.js", description: "React framework with SSR" },
      { label: "Remix", description: "Full-stack React framework" },
      { label: "Astro", description: "Content-focused static sites" },
    ],
    custom: false,
  },
  {
    id: "w2",
    question: "What styling approach do you prefer?",
    header: "Styling",
    options: [
      { label: "Tailwind CSS" },
      { label: "CSS Modules" },
      { label: "Vanilla Extract" },
    ],
    multiple: true,
    custom: true,
  },
  {
    id: "w3",
    question: "Should I set up a CI/CD pipeline?",
    header: "CI/CD",
    options: [
      { label: "GitHub Actions", description: "Built into GitHub" },
      { label: "Vercel", description: "Zero-config deploys" },
      { label: "Skip for now" },
    ],
    custom: false,
  },
];

export default function ChatAskUserExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <div className="space-y-8 max-w-lg">
      {/* Single question */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-3">
          Single question
        </p>
        <ChatAskUser
          questions={mockQuestions}
          onSubmit={(answers) => setSubmitted(JSON.stringify(answers, null, 2))}
        />
      </div>

      {/* Multi-step wizard */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-3">
          Multi-step wizard (3 questions)
        </p>
        <ChatAskUser
          questions={mockWizardQuestions}
          onSubmit={(answers) => setSubmitted(JSON.stringify(answers, null, 2))}
        />
      </div>

      {submitted && (
        <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto text-gray-600">
          {submitted}
        </pre>
      )}
    </div>
  );
}
