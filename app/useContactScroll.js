"use client";
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The trigger is the Contact SECTION, not the page. While the section overlaps
   this viewport window the cards sit at rest; the moment it enters the window
   `.in` is added and the cards glide in from their sides, and when it fully
   leaves the window `.in` is removed so they return to their sides, ready to
   replay on the next entry - from either direction, every time. */
const ROOT_MARGIN = "0px 0px -20% 0px";

/**
 * Contact card entrance, triggered by the Contact section entering the
 * viewport - the same IntersectionObserver architecture the rest of the page
 * uses (`.reveal`, `.section-heading`), so no new animation library is added.
 *
 * The left card travels in from the left and the right card from the right,
 * both gliding smoothly into their exact existing grid positions. The motion
 * itself is a CSS transition on `#contact.in .contact-animate`, so:
 *
 *   - It NEVER runs on page load: Contact is below the fold at load, the hook
 *     simply toggles `.in` when the section actually reaches the trigger
 *     window (~80% of the viewport height, so the entrance starts before the
 *     cards are fully visible).
 *   - It replays every entry: scrolling down into Contact and scrolling up
 *     into Contact from below both re-add `.in` and replay the entrance.
 *   - It resets when Contact leaves: fully scrolling past the section removes
 *     `.in`, returning the cards to their side starts for the next run.
 *
 * The start state is written by JS (so no-JS and reduced-motion visitors keep
 * the normal layout), which means it can only be applied AFTER first paint.
 * `html.contact-primed` holds the transition off while that first application
 * is committed, so the cards never play the entrance in reverse during load;
 * the priming is released once the observer has delivered its first state.
 *
 * No `once`, no one-shot timeline, no load-time trigger. Reduced-motion users
 * and no-JS visitors simply see the cards in their normal resting layout.
 */
export default function useContactScroll() {
  useIsomorphicLayoutEffect(() => {
    const section = document.getElementById("contact");
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") return;

    const cards = section.querySelectorAll(".contact-animate");
    if (!cards.length) return;

    const root = document.documentElement;
    let disposed = false;
    let priming = true;

    function releasePriming() {
      if (!priming) return;
      priming = false;
      requestAnimationFrame(() => {
        if (disposed) return;
        root.classList.remove("contact-primed");
      });
    }

    root.classList.add("contact-primed");
    root.classList.add("has-contact-anim");
    // Forces the style flush that commits the start state while the
    // transition is still disabled.
    cards.forEach((card) => void getComputedStyle(card).transform);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          section.classList.toggle("in", entry.isIntersecting);
        });
        releasePriming();
      },
      { rootMargin: ROOT_MARGIN }
    );

    io.observe(section);

    return () => {
      disposed = true;
      io.disconnect();
      root.classList.remove("contact-primed");
      root.classList.remove("has-contact-anim");
      section.classList.remove("in");
    };
  }, []);
}
