"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const BREAKPOINTS: [minWidth: number, perView: number][] = [
  [2001, 6],
  [1442, 5],
  [1026, 4],
  [770, 3],
  [482, 2],
];

const VARS =
  "[--n:1] min-[482px]:[--n:2] min-[770px]:[--n:3] min-[1026px]:[--n:4] min-[1442px]:[--n:5] min-[2001px]:[--n:6] [--gap:0px] min-[801px]:[--gap:11px]";

const SLIDE_W = "((100% - 1px - (var(--n) - 1) * var(--gap)) / var(--n))";
const SLIDE_W_INNER = "((100% - (var(--n) - 1) * var(--gap)) / var(--n))";

const SPEED = 300;
const SWIPE_DIVISOR = 5;
const EDGE_FRICTION = 0.35;

const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="20" height="41" viewBox="0 0 24 42" aria-hidden="true">
    <path
      d={
        dir === "prev"
          ? "M22.4572074 1.00746147l-21 20.02482143 20.9479397 19.9751786"
          : "M1.45679 1.00746147l21 20.02482143L1.50885 41.0074615"
      }
      stroke="#333333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

const ProductCarousel = ({ children }: { children: React.ReactNode }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const slides = React.Children.toArray(children);
  const count = slides.length;

  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState(false);

  const pages =
    count > perView ? 1 + Math.ceil((count - perView) / perView) : 1;
  const showNav = count > perView;
  const offset = Math.min(page * perView, Math.max(0, count - perView));

  useEffect(() => {
    const mqls = BREAKPOINTS.map(([w, n]) => ({
      mql: window.matchMedia(`(min-width: ${w}px)`),
      n,
    }));
    const read = () => setPerView(mqls.find((m) => m.mql.matches)?.n ?? 1);
    read();
    mqls.forEach((m) => m.mql.addEventListener("change", read));
    window.addEventListener("resize", read); // fallback
    return () => {
      mqls.forEach((m) => m.mql.removeEventListener("change", read));
      window.removeEventListener("resize", read);
    };
  }, []);

  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [pages]);

  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, pages - 1))),
    [pages],
  );

  // ── Drag / swipe (Slick draggable + swipe) ─────────────────────────────
  const drag = useRef({ startX: 0, startY: 0, moved: false, locked: false });

  const onPointerDown = (e: React.PointerEvent) => {
    if (!showNav || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      locked: false,
    };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const listW = listRef.current?.offsetWidth || 1;

    const move = (e: PointerEvent) => {
      const d = drag.current;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      // Let vertical page scrolls through on touch.
      if (!d.locked && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
        setDragging(false);
        setDragX(0);
        return;
      }
      if (Math.abs(dx) > 5) {
        d.moved = true;
        d.locked = true;
      }
      const atEdge = (page === 0 && dx > 0) || (page === pages - 1 && dx < 0);
      setDragX(atEdge ? dx * EDGE_FRICTION : dx);
    };

    const up = (e: PointerEvent) => {
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > listW / SWIPE_DIVISOR) goTo(page + (dx < 0 ? 1 : -1));
      setDragging(false);
      setDragX(0);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, page, pages, goTo]);

  // ── Arrow keys while the carousel is "focused" (clicked into) ──────────
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && page > 0) {
        e.preventDefault();
        goTo(page - 1);
      } else if (e.key === "ArrowRight" && page < pages - 1) {
        e.preventDefault();
        goTo(page + 1);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setActive(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [active, page, pages, goTo]);

  const arrowClass =
    "absolute top-1/2 -mt-[15px] -translate-y-1/2 z-[1] w-10 h-[61px] p-[10px] flex items-center justify-center cursor-pointer transition-opacity";

  return (
    <div
      ref={rootRef}
      className={`relative ${VARS}`}
      onMouseDown={() => setActive(true)}
    >
      {/* .slick-list */}
      <div ref={listRef} className="overflow-hidden">
        {/* .slick-track */}
        <div
          className="flex justify-center pl-px touch-pan-y select-none"
          style={{
            transform: `translateX(calc(${-offset} * (${SLIDE_W} + var(--gap)) + ${dragX}px))`,
            transition: dragging ? "none" : `transform ${SPEED}ms ease`,
          }}
          onPointerDown={onPointerDown}
          onDragStart={(e) => e.preventDefault()}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{
                width: `calc(${SLIDE_W_INNER})`,
                marginRight: i < count - 1 ? "var(--gap)" : undefined,
              }}
              aria-hidden={i < offset || i >= offset + perView}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className={`${arrowClass} -left-[15px] xl:-left-[47px] ${page === 0 ? "opacity-10 cursor-default" : "opacity-100"}`}
          >
            <span className="opacity-60">
              <Chevron dir="prev" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(page + 1)}
            disabled={page === pages - 1}
            className={`${arrowClass} -right-[10px] xl:-right-[47px] ${page === pages - 1 ? "opacity-10 cursor-default" : "opacity-100"}`}
          >
            <span className="opacity-60">
              <Chevron dir="next" />
            </span>
          </button>

          {/* .slick-dots */}
          <ul className="mt-[11px] h-[26px] text-center leading-[21px] list-none p-0">
            {Array.from({ length: pages }).map((_, i) => (
              <li key={i} className="inline-block w-[17px] h-[17px]">
                <button
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="relative w-[10px] h-[10px] p-0 rounded-full border border-[#333333] bg-transparent cursor-pointer"
                >
                  <span
                    className={`absolute -left-px -top-px w-[10px] h-[10px] rounded-full ${
                      i === page ? "bg-[#333333]" : "opacity-60"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
