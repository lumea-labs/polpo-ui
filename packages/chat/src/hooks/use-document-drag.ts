"use client";

import { useState, useRef, useEffect } from "react";

/** Track document-level drag state for visual feedback */
export function useDocumentDrag() {
  const [dragging, setDragging] = useState(false);
  const counterRef = useRef(0);
  useEffect(() => {
    const onEnter = (e: DragEvent) => { if (e.dataTransfer?.types?.includes("Files")) { counterRef.current++; setDragging(true); } };
    const onLeave = () => { counterRef.current--; if (counterRef.current === 0) setDragging(false); };
    const onDrop = () => { counterRef.current = 0; setDragging(false); };
    document.addEventListener("dragenter", onEnter);
    document.addEventListener("dragleave", onLeave);
    document.addEventListener("drop", onDrop);
    return () => { document.removeEventListener("dragenter", onEnter); document.removeEventListener("dragleave", onLeave); document.removeEventListener("drop", onDrop); };
  }, []);
  return dragging;
}
