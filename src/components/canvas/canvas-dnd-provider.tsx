"use client";

import { DndProvider } from "react-dnd";
import { useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useEffect, type ReactNode } from "react";

function CanvasScrollLock({ children }: { children: ReactNode }) {
  const isDragging = useDragLayer((monitor) => monitor.isDragging());

  useEffect(() => {
    if (!isDragging) return;
    const stopCanvasScroll = (event: TouchEvent) => {
      if (event.touches.length === 1) event.preventDefault();
    };
    document.addEventListener("touchmove", stopCanvasScroll, { capture: true, passive: false });
    return () => document.removeEventListener("touchmove", stopCanvasScroll, true);
  }, [isDragging]);

  return <>{children}</>;
}

/** Mobile-first backend: normal scrolling stays enabled until the long press completes. */
export function CanvasDndProvider({ children }: { children: ReactNode }) {
  return <DndProvider backend={TouchBackend} options={{ delayTouchStart: 1000, delayMouseStart: 120, touchSlop: 9, enableTouchEvents: true, enableMouseEvents: true, enableKeyboardEvents: true, enableHoverOutsideTarget: true }}><CanvasScrollLock>{children}</CanvasScrollLock></DndProvider>;
}
