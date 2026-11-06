import { Link } from 'react-router';

export default function NotFoundRoute() {
  return (
    <main
      data-screen-stub="not-found"
      className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-4 px-6 py-10"
    >
      <h1 className="font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
        Page not found
      </h1>
      <p className="text-[15px] text-ink-700">That link does not lead anywhere in Tryitout.</p>
      <Link to="/" className="text-[15px] font-semibold underline underline-offset-[3px]">
        Go to the start
      </Link>
    </main>
  );
}
