export function LegalPage({ title, bodyHtml }: { title: string; bodyHtml: string }) {
  return (
    <div className="wrap max-w-3xl py-14 md:py-20">
      <h1 className="text-[28px]">{title}</h1>
      <div className="mt-3 inline-flex items-center gap-2 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-text">
        Placeholder text, pending legal review before launch
      </div>
      <div className="prose prose-sm mt-8 max-w-none text-text" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}
