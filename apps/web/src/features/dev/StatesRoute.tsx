import { ScreenStub } from '@/ui/ScreenStub';

/** N9 system states: skeletons, empty states, offline banner, toasts, permission help. */
export default function StatesRoute() {
  return (
    <ScreenStub
      id="N9-system-states"
      title="System states"
      ships="V1"
      note="Dev builds only. Skeletons, empty states, the offline banner, toasts and camera-permission help (§12.6)."
    />
  );
}
