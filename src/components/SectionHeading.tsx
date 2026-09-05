export default function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-bold text-white">{title}</h2>
    </div>
  )
}
