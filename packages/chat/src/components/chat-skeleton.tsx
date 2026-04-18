/**
 * Skeleton loaders for chat UI — mirrors the exact layout of ChatMessageItem
 * so the loading state feels native, not jarring.
 */

function Bone({ width, height = 14 }: { width: string; height?: number }) {
  return (
    <div
      className="bg-accent animate-pulse"
      style={{ width, height, borderRadius: height > 20 ? 12 : 6 }}
    />
  );
}

/** Skeleton for an AI message: avatar + name + text lines */
export function MessageSkeleton({ lines = 3 }: { lines?: number }) {
  const widths = ["85%", "70%", "55%", "90%", "40%"];
  return (
    <div className="w-full px-6 pt-4 pb-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-6 rounded-md bg-accent animate-pulse shrink-0" />
          <Bone width="80px" height={13} />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: lines }, (_, i) => (
            <Bone key={i} width={widths[i % widths.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a user message: right-aligned bubble */
export function UserMessageSkeleton() {
  return (
    <div className="w-full px-6 py-3">
      <div className="max-w-3xl mx-auto flex justify-end">
        <div className="w-[45%] min-w-[120px] h-[42px] rounded-[18px_18px_4px_18px] bg-accent animate-pulse" />
      </div>
    </div>
  );
}

/** Full conversation skeleton — alternating user/AI messages */
export function ChatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="py-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <UserMessageSkeleton />
          <MessageSkeleton lines={i === 0 ? 2 : i === 1 ? 4 : 3} />
        </div>
      ))}
    </div>
  );
}
