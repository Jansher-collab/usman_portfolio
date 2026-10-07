"use client";
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Final-signature reveal that replays EVERY time the section enters the
 * viewport — scrolling down or scrolling up — using the same IntersectionObserver
 * architecture as useReveal / useHeadingReveal (GSAP is not a project
 * dependency, so none is added).
 *
 * The difference from those one-shot observers is that here `.in` is added on
 * enter and removed once an element scrolls back out of view. That resets the
 * name (and its surrounding elements) to the hidden start state — lower,
 * blurred, slightly scaled — so the exact same reveal plays again from the
 * beginning on every re-entry.
 *
 * The hidden start state lives behind `html.has-heading-anim` (same gate as
 * every other section heading), so with JS unavailable or
 * prefers-reduced-motion the section is simply visible.
 */
export default function useSignatureReveal() {
  useIsomorphicLayoutEffect(() => {
    const section = document.getElementById("signature");
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") return;

    const heading = section.querySelector(".section-heading");
    const reveals = Array.from(section.querySelectorAll(".reveal"));
    if (!heading && !reveals.length) return;

    document.documentElement.classList.add("has-heading-anim");

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });

    const targets = heading ? [heading, ...reveals] : reveals;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in", entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" }
    );

    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      targets.forEach((el) => el.classList.remove("in"));
    };
  }, []);
}