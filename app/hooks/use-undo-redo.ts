"use client";

import { useCallback, useRef, useState } from "react";

const MAX_HISTORY = 40;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function useUndoRedo<T>(initialValue: T) {
  const [present, setPresent] = useState<T>(initialValue);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const [version, setVersion] = useState(0);

  const bump = () => setVersion((v) => v + 1);

  const reset = useCallback((value: T) => {
    setPresent(clone(value));
    pastRef.current = [];
    futureRef.current = [];
    bump();
  }, []);

  const commit = useCallback((updater: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: T) => T)(prev)
          : updater;
      if (JSON.stringify(next) === JSON.stringify(prev)) return prev;
      pastRef.current.push(clone(prev));
      if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();
      futureRef.current = [];
      bump();
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    const past = pastRef.current;
    if (past.length === 0) return;
    const previous = past.pop()!;
    futureRef.current.push(clone(present));
    setPresent(previous);
    bump();
  }, [present]);

  const redo = useCallback(() => {
    const future = futureRef.current;
    if (future.length === 0) return;
    const next = future.pop()!;
    pastRef.current.push(clone(present));
    setPresent(next);
    bump();
  }, [present]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return {
    present,
    commit,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
    version,
  };
}
