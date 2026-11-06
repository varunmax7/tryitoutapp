import { useState } from 'react';
import { AppIcon, AppMark, Wordmark } from '@/ui/AppMark';
import { Button, IconButton, TextLink } from '@/ui/Button';
import { Card, ReviewCard, TapeCard, ToolTile } from '@/ui/Card';
import { ConfidenceChip, FitChip } from '@/ui/Chips';
import { PillToggle, Segmented, Switch } from '@/ui/Toggles';
import { ProgressBar, RadioTile, SearchField, TextField } from '@/ui/Fields';
import { BrandRow, BrandRowDivider, FitBar, SizePicker, StepList } from '@/ui/Fit';
import { Avatar, LargeTitleHeader, TopBar } from '@/ui/Nav';
import { AnimatedNumber, AnimatedSize } from '@/ui/AnimatedNumber';
import { Skeleton } from '@/ui/Skeleton';
import { BottomSheet } from '@/ui/BottomSheet';
import { showToast } from '@/ui/Toast';
import { CameraOverlay, FitCallout, FitLegend, Shutter } from '@/ui/Camera';
import { Pressable } from '@/ui/motion/Pressable';
import * as icons from '@/ui/icons';

/**
 * Component gallery — implementation.md §15 Phase 1 task 1. Dev builds only.
 *
 * Every component in the §12.4 inventory has a demo here, including the ones whose
 * screens arrive in a later phase, so none of them is built blind and none of them
 * rots unseen.
 */
export default function UiGalleryRoute() {
  const [size, setSize] = useState('L');
  const [segment, setSegment] = useState('m');
  const [on, setOn] = useState(true);
  const [pill, setPill] = useState('tops');
  const [shape, setShape] = useState('athletic');
  const [sheet, setSheet] = useState(false);
  const [count, setCount] = useState(98);

  const iconEntries = Object.entries(icons).filter(([name]) => name.startsWith('Icon'));

  return (
    <main
      data-screen="dev-ui"
      className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-4 py-8"
    >
      <header className="flex flex-col gap-1">
        <h1 className="type-display-m m-0">Component gallery</h1>
        <p className="m-0 text-[14px] text-ink-500">implementation.md §12.4. Dev builds only.</p>
      </header>

      <Section title="Marks">
        <div className="flex items-center gap-4">
          <AppMark />
          <AppIcon />
          <Wordmark />
        </div>
      </Section>

      <Section title="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Delete everything</Button>
        <div className="flex items-center gap-3">
          <IconButton aria-label="Close">
            <icons.IconClose size={20} />
          </IconButton>
          <TextLink as="button" type="button">
            A text link
          </TextLink>
          <Pressable press="card" className="rounded-12 bg-surface-0 p-3 text-[14px]">
            Pressable card
          </Pressable>
        </div>
      </Section>

      <Section title="Chips">
        <div className="flex flex-wrap gap-2">
          <FitChip tag="great" />
          <FitChip tag="good" />
          <FitChip tag="slightly_loose" />
          <FitChip tag="slightly_tight" />
          <FitChip tag="not_recommended" />
          <ConfidenceChip label="High confidence" />
        </div>
      </Section>

      <Section title="Toggles">
        <div className="flex flex-wrap gap-2">
          {['tops', 'jeans', 'kurtas'].map((key) => (
            <PillToggle key={key} pressed={pill === key} onPress={() => setPill(key)}>
              {key}
            </PillToggle>
          ))}
        </div>
        <Segmented
          label="Sizes"
          value={segment}
          onChange={setSegment}
          tall
          items={[
            { value: 's', label: 'S', sub: 'Tight' },
            { value: 'm', label: 'M', sub: 'Great' },
            { value: 'l', label: 'L', sub: 'Loose' },
          ]}
        />
        <div className="flex items-center gap-3">
          <Switch checked={on} onChange={setOn} label="Fit map" />
          <span className="text-[14px]">Switch</span>
        </div>
      </Section>

      <Section title="Fields">
        <div className="grid grid-cols-3 gap-2">
          <TextField label="Height" unit="cm" defaultValue="175" />
          <TextField label="Weight" unit="kg" defaultValue="72" />
          <TextField label="Age" unit="yrs" defaultValue="24" error="18 to 100" />
        </div>
        <SearchField label="Search brands" placeholder="Search any brand" />
        <div className="grid grid-cols-4 gap-2">
          {['slim', 'athletic', 'regular', 'broad'].map((key) => (
            <RadioTile
              key={key}
              name="gallery-shape"
              label={key}
              selected={shape === key}
              onSelect={() => setShape(key)}
            />
          ))}
        </div>
        <ProgressBar value={0.5} label="Step 1 of 2" />
      </Section>

      <Section title="Cards">
        <Card>A plain card.</Card>
        <TapeCard
          title="Your measurements · cm"
          values={[
            { label: 'Chest', value: <AnimatedNumber value={count} memoryKey="gallery-chest" /> },
            { label: 'Waist', value: 84 },
            { label: 'Hip', value: 96 },
            { label: 'Shoulder', value: 45 },
          ]}
          action={
            <button
              type="button"
              className="text-[13px] font-semibold underline underline-offset-[3px]"
              onClick={() => setCount((c) => (c === 98 ? 104 : 98))}
            >
              Tick the number
            </button>
          }
        />
        <ReviewCard
          icon={<icons.IconExchange size={16} strokeWidth={2.2} />}
          title="Next time we'll suggest M"
          body="Returning it? Ask for M in the exchange."
        />
        <div className="grid grid-cols-2 gap-2">
          <ToolTile
            icon={<icons.IconShoe size={28} />}
            title="Shoe size"
            sub="Stand on an A4 sheet"
          />
          <ToolTile
            icon={<icons.IconScissors size={28} />}
            title="Tailor card"
            sub="Send cm to your tailor"
          />
        </div>
      </Section>

      <Section title="Fit">
        <FitBar value={0.5} labels={['Tight', 'Good', 'Loose']} />
        <SizePicker
          label="Size to try"
          sizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
          selected={size}
          compare="M"
          onSelect={setSize}
          caption="L is your size. Pick any size to see the difference."
        />
        <div className="rounded-18 bg-surface-0 py-1">
          <BrandRow
            to="/dev/ui"
            monogram="Z"
            name="Zara"
            note="True to size for you"
            size="M"
            fitTag="great"
          />
          <BrandRowDivider />
          <BrandRow
            to="/dev/ui"
            monogram="H&M"
            name="H&M"
            note="Runs small at the chest"
            size="L"
            fitTag="good"
          />
        </div>
        <div className="rounded-18 bg-surface-0 px-[14px]">
          <StepList
            steps={[
              { label: 'Cut out of your photo', state: 'done' },
              { label: 'Draping on your body', state: 'running', progress: 0.7 },
              { label: 'Open live camera', state: 'pending' },
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <Avatar initial="A" label="Aarav" selected />
          <Avatar initial="M" label="Maa" tone="tight" />
          <span className="type-numeral-hero">
            <AnimatedSize value={size} />
          </span>
        </div>
      </Section>

      <Section title="Bars">
        <TopBar backTo="/dev/ui" title="A top bar" />
        <LargeTitleHeader greeting="Hi, you" title="A large title" />
      </Section>

      <Section title="Overlays">
        <Button variant="secondary" onClick={() => setSheet(true)}>
          Open a bottom sheet
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast('Saved', { label: 'Undo', onClick: () => {} })}
        >
          Show a toast
        </Button>
        <BottomSheet open={sheet} onOpenChange={setSheet} title="A sheet">
          <div className="flex flex-col gap-3 p-5">
            <p className="m-0 text-[15px]">Drag it, flick it, or press Escape.</p>
            <Button onClick={() => setSheet(false)}>Close</Button>
          </div>
        </BottomSheet>
      </Section>

      <Section title="Skeletons">
        <Skeleton className="h-[58px]" />
        <Skeleton className="h-[58px]" />
      </Section>

      <Section title="Camera and 3D (dark)">
        <div data-on-dark className="relative h-[320px] overflow-hidden rounded-18 bg-dark-900 p-3">
          <CameraOverlay
            step="Front photo · 1 of 2"
            checks={[
              { label: 'Full body in frame', passed: true },
              { label: 'Good light', passed: true },
              { label: 'Move your arms out', passed: false, warning: true },
            ]}
          />
          <div className="absolute top-3 left-3">
            <FitLegend />
          </div>
          <div className="absolute top-3 right-3">
            <FitCallout status="right" title="Just right" detail="Shoulders & chest" />
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <Shutter armed onCapture={() => {}} />
          </div>
        </div>
      </Section>

      <Section title={`Icons (${iconEntries.length})`}>
        <div className="grid grid-cols-8 gap-3">
          {iconEntries.map(([name, Icon]) => (
            <span key={name} title={name} className="flex items-center justify-center">
              <Icon size={22} />
            </span>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="type-micro m-0 text-ink-500">{title}</h2>
      {children}
    </section>
  );
}
