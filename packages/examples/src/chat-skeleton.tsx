"use client";

import {
  ChatSkeleton,
  MessageSkeleton,
  UserMessageSkeleton,
} from "@polpo-ai/chat";

export default function ChatSkeletonExample() {
  return (
    <div className="space-y-8">
      {/* Full conversation skeleton */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 px-6">
          ChatSkeleton (full conversation)
        </p>
        <ChatSkeleton count={2} />
      </div>

      {/* Individual skeletons */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 px-6">
          MessageSkeleton (single AI message)
        </p>
        <MessageSkeleton lines={4} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 px-6">
          UserMessageSkeleton (single user bubble)
        </p>
        <UserMessageSkeleton />
      </div>
    </div>
  );
}
