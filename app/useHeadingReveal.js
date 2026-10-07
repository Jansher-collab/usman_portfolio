"use client";
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Section-heading reveal, built on the same IntersectionObserver approach as
 * useReveal (GSAP is not a project dependency, so none is added).
 *
 * Headings start blurred / lowered / slightly scaled and sharpen as their
 * section scrolls in (roughly ScrollTrigger's start: "top 80%"), while a
 * subtle gold text-shadow fades up. Plays once per heading.
 *
 * The hidden start state lives behind `html.has-heading-anim` and is only
 * applied when the visitor allows motion, so with JS disabled - or with
 * prefers-reduced-motion - every heading is simply visible.
 */
export default function useHeadingReveal() {
  useIsomorphicLayoutEffect(() => {
    // The final signature heading replays via useSignatureReveal, so it is
    // excluded here: this observer adds `.in` once and unobserves, which would
    // prevent the signature name from replaying on every scroll entry.
    const heads = Array.from(document.querySelectorAll(".section-heading")).filter(
      (el) => !el.closest("#signature")
    );
    if (!heads.length) return;
    if (typeof IntersectionObserver === "undefined") return;

    document.documentElement.classList.add("has-heading-anim");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" }
    );

    heads.forEach((h) => io.observe(h));

    return () => {
      io.disconnect();
      heads.forEach((h) => h.classList.remove("in"));
    };
  }, []);
}