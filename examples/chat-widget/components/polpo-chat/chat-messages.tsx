"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { ChatMessage } from "@polpo-ai/sdk";
import { useChatContext } from "./chat-provider";
import { ChatSkeleton } from "./chat-skeleton";
import { ChatScrollButton } from "./chat-scroll-button";
import { getTextContent } from "@/lib/polpo-chat/get-text-content";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChatMessagesHandle {
  /** Scroll the list to the bottom. */
  scrollToBottom: (behavior?: "smooth" | "auto") => void;
}

export interface ChatMessagesProps {
  /**
   * Custom renderer for each message.
   * Receives the message, its index, whether it is the last item, and
   * whether the assistant is currently streaming.
   */
  renderItem?: (
    msg: ChatMessage,
    index: number,
    isLast: boolean,
    isStreaming: boolean,
  ) => ReactNode;
  /** Extra classes applied to the Virtuoso container. */
  className?: string;
  /** Number of skeleton pairs to show during the initial load. */
  skeletonCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Default renderer (plain text fallback)                             */
/* ------------------------------------------------------------------ */

function DefaultMessageItem({ msg }: { msg: ChatMessage }) {
  const text = getTextContent(msg.content);
  return (
    <div className="w-full px-6 py-3">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium opacity-50 mb-1">
          {msg.role === "user" ? "You" : "Assistant"}
        </p>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (keeps Virtuoso happy for follow-output)                    */
/* ------------------------------------------------------------------ */

function VirtuosoFooter() {
  return <div className="h-px" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ChatMessages = forwardRef<ChatMessagesHandle, ChatMessagesProps>(
  function ChatMessages({ renderItem, className, skeletonCount = 3 }, ref) {
    const { messages, isStreaming, status } = useChatContext();

    /* ── Virtuoso ref & scroll state ────────────────────────────── */
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const prevMessageCountRef = useRef(0);
    const hasInitialScrollRef = useRef(false);

    /* ── Scroll helpers ─────────────────────────────────────────── */
    const scrollToBottom = useCallback(
      (behavior: "smooth" | "auto" = "smooth") => {
        virtuosoRef.current?.scrollToIndex({
          index: "LAST",
          align: "end",
          behavior,
        });
        setShowNewMessage(false);
      },
      [],
    );

    useImperativeHandle(ref, () => ({ scrollToBottom }), [scrollToBottom]);

    /* ── Bottom-state change handler ────────────────────────────── */
    const handleAtBottomStateChange = useCallback((atBottom: boolean) => {
      setIsAtBottom(atBottom);
      if (atBottom) setShowNewMessage(false);
    }, []);

    /* ── Initial scroll to bottom once messages load ────────────── */
    useEffect(() => {
      if (messages.length > 0 && !hasInitialScrollRef.current) {
        hasInitialScrollRef.current = true;
        requestAnimationFrame(() =>
          virtuosoRef.current?.scrollToIndex({
            index: "LAST",
            align: "end",
            behavior: "auto",
          }),
        );
      }
    }, [messages.length]);

    /* ── Reset scroll flag when data source changes ─────────────── */
    useEffect(() => {
      hasInitialScrollRef.current = false;
    }, [status]);

    /* ── Show "new messages" badge when not at bottom ───────────── */
    useEffect(() => {
      const cur = messages.length;
      const prev = prevMessageCountRef.current;
      if (cur > prev && !isAtBottom && prev > 0) {
        setShowNewMessage(true);
      }
      prevMessageCountRef.current = cur;
    }, [messages.length, isAtBottom]);

    /* ── Item renderer ──────────────────────────────────────────── */
    const itemContent = useCallback(
      (index: number, msg: ChatMessage) => {
        const isLast = index === messages.length - 1;
        if (renderItem) {
          return renderItem(msg, index, isLast, isStreaming);
        }
        return <DefaultMessageItem msg={msg} />;
      },
      [messages.length, isStreaming, renderItem],
    );

    /* ── Loading state ──────────────────────────────────────────── */
    if (status === "loading") {
      return (
        <div className={`flex-1 overflow-hidden ${className ?? ""}`}>
          <ChatSkeleton count={skeletonCount} />
        </div>
      );
    }

    /* ── Main list ──────────────────────────────────────────────── */
    return (
      <div className={`relative flex-1 min-h-0 ${className ?? ""}`}>
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          followOutput="auto"
          atBottomStateChange={handleAtBottomStateChange}
          atBottomThreshold={100}
          defaultItemHeight={120}
          overscan={500}
          increaseViewportBy={{ top: 300, bottom: 300 }}
          skipAnimationFrameInResizeObserver
          itemContent={itemContent}
          className="h-full"
          components={{ Footer: VirtuosoFooter }}
        />

        <ChatScrollButton
          isAtBottom={isAtBottom}
          showNewMessage={showNewMessage}
          onClick={() => scrollToBottom()}
        />
      </div>
    );
  },
);
