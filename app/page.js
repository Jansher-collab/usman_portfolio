"use client";
import { useEffect, useRef, useState } from "react";
import useReveal from "./useReveal";
import useContactScroll from "./useContactScroll";
import useHeadingReveal from "./useHeadingReveal";
import useSignatureReveal from "./useSignatureReveal";
import GlowingSquares from "./components/GlowingSquares";
import InfiniteMarquee from "./components/InfiniteMarquee";
import TechnologyMarquee from "./components/TechnologyMarquee";
import RotatingSquare from "./components/RotatingSquare";
import ContactForm from "./components/ContactForm";
import SignatureSection from "./components/SignatureSection";
import { contact, hero, nav, profile, projects, services, socials, technologyRows } from "./data/portfolio";

function Silhouette({ className = "" }) {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" className={className}>
      <rect width="300" height="400" fill="#f3e9e8" />
      <circle cx="150" cy="130" r="58" fill="#e6c9c9" />
      <path d="M40 400c0-90 50-140 110-140s110 50 110 140z" fill="#e6c9c9" />
    </svg>
  );
}

function PhotoSlot({ src, onPick, className = "", children }) {
  return (
    <div
      className={`relative overflow-hidden cursor-pointer bg-white/10 ${className}`}
      onClick={onPick}
      title="Click to add your photo"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Portrait" className="w-full h-full object-cover object-top" />
      ) : (
        <Silhouette className="w-full h-full" />
      )}
      {children}
    </div>
  );
}

function ServiceCard({ s, i }) {
  return (
    <div className="text-left border border-line/60 bg-slate rounded-2xl p-6 h-full hover:border-gold/60 hover:shadow-[0_20px_40px_-20px_rgba(212,175,55,0.3)] transition">
      <span className="mono-label !text-ink/50">// Host 0{i + 1}</span>
      <h3 className="text-[clamp(1.05rem,1.6vw,1.25rem)] font-bold mt-3 mb-2 text-white">{s.t}</h3>
      <p className="text-ink/70 text-[13px] leading-relaxed">{s.d}</p>
      <span className="inline-block mt-4 mono-label !text-gold border border-line rounded-full px-3 py-1.5 bg-ash">
        {s.c}
      </span>
    </div>
  );
}

function ProjectCard({ p, i }) {
  return (
    <div className="text-left border border-line/60 bg-slate rounded-2xl p-6 h-full hover:border-gold/60 hover:shadow-[0_20px_40px_-22px_rgba(212,175,55,0.3)] transition">
      <div className="flex justify-between items-center">
        <span className="mono-label !text-ink/45">// Project 0{i + 1}</span>
        <span className="mono-label !text-gold border border-gold/40 rounded-full px-3 py-1 bg-ash">{p.tag}</span>
      </div>
      <h3 className="text-[clamp(1.05rem,1.6vw,1.25rem)] font-bold mt-3 mb-2 text-white">{p.n}</h3>
      <p className="text-ink/70 text-[13px] leading-relaxed">{p.d}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {p.tech.map((t) => (
          <span key={t} className="mono-label !text-ink border border-line rounded-full px-3 py-1 bg-ash">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useReveal();
  useContactScroll();
  useHeadingReveal();
  useSignatureReveal();
  useEffect(() => {
    const out = [];
    ["expertise", "projects"].forEach((sec) => {
      const set = document.querySelector(`#${sec} .marquee-set`);
      if (!set) return;
      [...set.children].forEach((wrap, i) => {
        const card = wrap.firstElementChild;
        const cs = getComputedStyle(wrap);
        const cc = getComputedStyle(card);
        out.push(
          `${sec}[${i}] wrap=${wrap.offsetWidth}x${wrap.offsetHeight} ` +
            `card=${card.offsetWidth}x${card.offsetHeight} ` +
            `wrapAlign=${cs.alignSelf} cardH=${cc.height} cardFlex=${cc.flex}`
        );
      });
      const t = getComputedStyle(set);
      const tr = getComputedStyle(set.parentElement);
      out.push(`${sec} setAlign=${t.alignItems} trackAlign=${tr.alignItems}`);
    });
    document.title = "VW" + window.innerWidth + " || " + out.join(" | ");
  }, []);
  const heroRef = useRef(null);
  const fileRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [scale, setScale] = useState(1);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [active, setActive] = useState("home");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(profile.photoStorageKey);
      if (saved) setPhoto(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    function onScroll() {
      const el = heroRef.current;
      if (!el) return;
      const max = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)));
      const i = Math.min(hero.words.length - 1, Math.floor(p * hero.words.length * 0.92));
      setIdx(i);
      setScale(1 + p * 0.12);
      setHeroOpacity(1 - Math.max(0, (p - 0.85) / 0.15));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.toLowerCase());
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setPhoto(r.result);
      try {
        localStorage.setItem(profile.photoStorageKey, r.result);
      } catch (err) {}
    };
    r.readAsDataURL(f);
  }

  const w = hero.words[idx];

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3.5 bg-coal/95 backdrop-blur border-b border-gold/20 shadow-[0_4px_24px_-16px_rgba(0,0,0,0.9)]">
        <a href="#home" className="font-black text-lg text-gold">
          {profile.name}<span className="text-gold">.</span>
        </a>
        <ul className="hidden md:flex gap-6 lg:gap-7 text-[11.5px] md:text-[12px] font-medium">
            {nav.map((n) => {
              const id = n.toLowerCase();
              return (
                <li key={n}>
                  <a
                    href={`#${id}`}
                    className={`relative after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:rounded-full after:bg-gold after:transition-all after:duration-300 ${
                      active === id
                        ? "text-gold font-bold after:w-full"
                        : "text-ink hover:text-gold after:w-0 hover:after:w-full"
                    }`}
                  >
                    {n}
                  </a>
                </li>
              );
            })}
          </ul>
        <a href="#contact" className="rounded-full bg-gold text-black text-[12px] font-bold px-5 py-2.5 shadow-[0_6px_20px_-10px_rgba(212,175,55,0.5)] hover:bg-gold-bright transition">
          Hire Me
        </a>
      </nav>

      {/* HERO */}
      <header ref={heroRef} id="home" className="relative bg-coal" style={{ height: "320vh" }}>
        <div
          className="hero-stage sticky top-0 h-screen overflow-hidden bg-coal"
          style={{ opacity: heroOpacity }}
        >
          {/* soft gold glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gold/10 blur-3xl" />

          <div
            className="hero-figure absolute left-1/2 bottom-0 h-[80vh] md:h-[86vh] aspect-[3/4] -translate-x-1/2 pointer-events-none"
            style={{ transform: `translateX(-50%) scale(${scale})` }}
          >
            <RotatingSquare />
          </div>
          <PhotoSlot
            src={photo}
            onPick={() => fileRef.current?.click()}
            className="hero-figure hero-figure-frame absolute left-1/2 bottom-0 h-[80vh] md:h-[86vh] aspect-[3/4] -translate-x-1/2 rounded-t-[40px] border-x border-t border-white/25 shadow-[0_0_140px_-30px_rgba(0,0,0,0.6)]"
          >
            <div style={{ position: "absolute", inset: 0 }} />
          </PhotoSlot>
          <div
            className="hero-figure absolute left-1/2 bottom-0 h-[80vh] md:h-[86vh] aspect-[3/4] -translate-x-1/2 pointer-events-none"
            style={{ transform: `translateX(-50%) scale(${scale})` }}
          />

          <div className="hero-copy absolute left-4 md:left-10 top-[34%] md:top-[44%] z-10 max-w-[92vw] md:max-w-[42vw]">
            <div className="hero-eyebrow mono-label mb-3 !text-white/60">
              Hi, I&apos;m <span className="text-white underline decoration-gold-bright underline-offset-4">{profile.name}</span>
            </div>
            <h1 className="hero-title font-black uppercase leading-[1.04] tracking-tight text-[clamp(1.85rem,5.3vw,3.95rem)] text-white">
              {w.h[0]}
              <br />
              <span className="text-gold-bright">{w.h[1]}</span>
            </h1>
          </div>

          <div className="hidden md:block absolute right-10 top-[40%] w-[280px] z-10">
            <div className="hero-blurb-lead mono-label !text-white/60">{w.s}</div>
            <p className="hero-blurb-body mt-2.5 text-[13px] leading-relaxed text-white/75">{w.d}</p>
          </div>

          <div className="hero-cta absolute right-4 md:right-10 bottom-10 md:bottom-16 z-10 flex flex-wrap gap-2.5">
            <a href="#projects" className="rounded-full bg-gold text-black text-[12px] font-bold px-4 md:px-5 py-2.5 shadow-[0_10px_30px_-12px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 hover:bg-gold-bright transition">
              View My Work
            </a>
            <a href="#contact" className="rounded-full border border-gold/60 text-gold-bright text-[12px] font-bold px-4 md:px-5 py-2.5 hover:-translate-y-0.5 hover:bg-gold hover:border-gold hover:text-black transition">
              Contact Me
            </a>
          </div>
          <div className="hero-cta absolute left-4 md:left-10 bottom-10 md:bottom-16 mono-label !text-white/50 z-10">
            ↓ Scroll to scrub timeline
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="px-5 md:px-10 py-20 md:py-24 bg-ash">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[300px_1fr] gap-10 md:gap-14 items-center reveal">
          <div className="relative w-full max-w-[300px] aspect-[3/4] mx-auto md:mx-0">
            <GlowingSquares className="absolute inset-0" />
            <RotatingSquare />
            <PhotoSlot
              src={photo}
              onPick={() => fileRef.current?.click()}
              className="relative w-full h-full rounded-[28px] border border-gold/30 shadow-[0_0_90px_-25px_rgba(212,175,55,0.35)] z-10"
            >
              <div className="absolute left-3 right-3 bottom-3 bg-black/25 backdrop-blur text-white rounded-xl px-4 py-2.5 flex justify-between items-center">
                <span className="mono-label !text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-bright inline-block" />
                  {profile.statusBadge}
                </span>
                <span className="mono-label !text-white">{profile.yearBadge}</span>
              </div>
            </PhotoSlot>
          </div>
          <div>
            <span className="mono-label !text-gold border border-line rounded-full px-3.5 py-1.5 bg-slate">// System profile</span>
            <h2 className="section-heading font-black about-title mt-4 mb-4 text-white">
              {profile.headline} <span className="text-gold">{profile.name}</span>
            </h2>
            <p className="text-ink/70 leading-relaxed max-w-xl text-[15px]">{profile.bio}</p>
            <div className="grid grid-cols-3 gap-3 mt-7">
              {profile.stats.map(({ a, b }) => (
                <div key={a} className="border border-line bg-slate rounded-2xl p-4 transition hover:border-gold/50 hover:shadow-[0_0_28px_-12px_rgba(212,175,55,0.35)]">
                  <b className="block text-[13px] mb-1.5 text-ink">{a}</b>
                  <span className="mono-label !text-ink/55">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" className="px-5 md:px-10 py-20 md:py-24 bg-coal text-center">
        <span className="mono-label !text-gold border border-line rounded-full px-3.5 py-1.5 bg-slate">// Expertise</span>
        <h2 className="section-heading font-black text-[clamp(1.7rem,3.8vw,2.6rem)] mt-4 mb-10 text-white">What I Do</h2>
        <InfiniteMarquee
          items={services}
          gap={20}
          speed={44}
          renderItem={(s, i) => (
            <div className="w-[min(82vw,320px)] shrink-0">
              <ServiceCard s={s} i={i} />
            </div>
          )}
        />
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-5 md:px-10 py-20 md:py-24 bg-ash text-center">
        <span className="mono-label !text-gold border border-line rounded-full px-3.5 py-1.5 bg-slate">● Technical stack</span>
        <h2 className="section-heading font-black text-[clamp(1.7rem,3.8vw,2.6rem)] mt-4 mb-2 text-white">Technologies I Work With</h2>
        <p className="mono-label !text-ink/55">Full-stack expertise across web development, databases and cloud</p>
        <TechnologyMarquee rows={technologyRows} />
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-5 md:px-10 py-20 md:py-24 bg-coal text-center">
        <span className="mono-label !text-white/70 border border-white/20 rounded-full px-3.5 py-1.5 bg-white/[0.06]">// Portfolio work</span>
        <h2 className="section-heading font-black text-[clamp(1.7rem,3.8vw,2.6rem)] mt-4 mb-10 text-white">Featured Engineering Projects</h2>
        <InfiniteMarquee
          items={projects}
          gap={20}
          speed={50}
          reverse
          renderItem={(p, i) => (
            <div className="w-[min(82vw,340px)] shrink-0">
              <ProjectCard p={p} i={i} />
            </div>
          )}
        />
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-5 md:px-10 py-20 md:py-28 text-center bg-smoke">
        <div className="max-w-5xl mx-auto contact-stage">
          <div className="contact-watermark" aria-hidden="true">
            {contact.headline}
          </div>
          <div className="contact-layer">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Box 1 — Introduction */}
            <div className="contact-animate contact-left flex flex-col justify-between rounded-3xl border border-line bg-slate p-8">
              <div>
                <span className="mono-label !text-gold">// Introduction</span>
                <h3 className="mt-4 text-[clamp(1.5rem,3vw,2rem)] font-black leading-tight text-white">{contact.subline}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">{contact.intro}</p>
                <div className="flex flex-wrap gap-3 mt-8">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      className="rounded-full border border-line/80 text-[12px] font-bold px-5 py-2.5 text-ink hover:-translate-y-0.5 hover:border-gold hover:text-gold-bright transition"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="mt-10 inline-flex items-center gap-2 mono-label !text-ink border-b-2 border-gold pb-1 w-fit transition hover:text-gold-bright"
              >
                {contact.email}
              </a>
            </div>

            {/* Box 2 — Contact form */}
            <ContactForm email={contact.email} className="contact-animate contact-right" />
          </div>
          </div>
        </div>
      </section>

      {/* FINAL SIGNATURE */}
      <SignatureSection />

      <footer className="py-6 text-center bg-coal text-ink/75 mono-label border-t-2 border-gold/20">
        © 2026 <span className="text-gold">{profile.name}</span>. All rights reserved.
      </footer>
    </>
  );
}