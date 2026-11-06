/**
 * The §12.6 screens that are sheets over another screen rather than routes of their own:
 * N1 consent and age gate, N5 brand request, N7 "Did you buy it?", N8 install prompt,
 * N12 app settings. They are listed here so every designed screen has one reachable stub.
 */
const SHEETS = [
  ['N1', 'Consent and age gate', 'Shown before any measurement. 18+ in V1.'],
  ['N5', 'Brand request', 'Search empty state with "Request {query}".'],
  ['N7', 'Did you buy it?', 'Shown on return from the store; asks for push on "Yes".'],
  ['N8', 'Install prompt', 'After the first successful size result. Dismissible.'],
  ['N12', 'App settings', 'Reduce motion, haptics and the app version.'],
] as const;

export default function SheetsGalleryRoute() {
  return (
    <main
      data-screen-stub="dev-sheets"
      className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-4 px-6 py-10"
    >
      <p className="font-mono text-[12px] font-semibold tracking-[0.06em] text-ink-500 uppercase">
        dev-sheets · V1
      </p>
      <h1 className="font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
        Sheets
      </h1>
      <ul className="flex list-none flex-col gap-3 p-0">
        {SHEETS.map(([id, title, note]) => (
          <li
            key={id}
            data-sheet-stub={id}
            className="rounded-18 border border-line-200 bg-surface-0 p-4"
          >
            <p className="font-mono text-[13px] font-semibold text-ink-500">{id}</p>
            <p className="text-[17px] font-semibold">{title}</p>
            <p className="text-[14px] text-ink-700">{note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
