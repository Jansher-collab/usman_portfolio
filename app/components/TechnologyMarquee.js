import InfiniteMarquee from "./InfiniteMarquee";

function MarqueePill({ label }) {
  return (
    <span className="mono-label !text-ink text-[12px] md:text-[13px] whitespace-nowrap border border-line/70 rounded-full px-5 py-2.5 bg-slate hover:bg-raised hover:border-gold/60 hover:shadow-[0_0_20px_-6px_rgba(212,175,55,0.5)] transition-colors">
      {label}
    </span>
  );
}

export default function TechnologyMarquee({ rows, speeds = [42, 50] }) {
  return (
    <div className="space-y-6 mt-10">
      {rows.map((items, i) => (
        <InfiniteMarquee
          key={i}
          items={items}
          gap={12}
          speed={speeds[i % speeds.length]}
          reverse={i % 2 === 1}
          renderItem={(t) => <MarqueePill label={t} />}
        />
      ))}
    </div>
  );
}