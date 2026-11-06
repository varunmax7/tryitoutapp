import { ScreenStub } from '@/ui/ScreenStub';

/** Dev-only component gallery (§12.4). Built out in Phase 1 task 1. */
export default function UiGalleryRoute() {
  return (
    <ScreenStub
      id="dev-ui"
      title="Component gallery"
      ships="V1"
      note="Dev builds only. Every component in §12.4 gets a demo here in Phase 1."
    />
  );
}
