"use client";
import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    // The final signature section has its own replaying reveal (useSignatureReveal),
    // so its elements are left out of this one-shot observer to avoid a fight
    // over the `.in` class.
    const els = Array.from(document.querySelectorAll(".reveal")).filter(
      (el) => !el.closest("#signature")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    return () => {
      io.disconnect();
      els.forEach((el) => el.classList.remove("in"));
    };
  }, []);
}
