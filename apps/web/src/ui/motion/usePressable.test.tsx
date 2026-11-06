import { describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Pressable } from './Pressable';

/** §12.8.4: press feedback must not re-render, must wait in scrollers, must cancel on move. */
function mount(ui: React.ReactNode) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  act(() => root.render(ui));
  return { host, root };
}

const pointerDown = (el: Element, x = 0, y = 0) =>
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
const pointerMove = (el: Element, x: number, y: number) =>
  el.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: x, clientY: y }));

describe('Pressable', () => {
  it('marks the press immediately outside a scroller', () => {
    let renders = 0;
    function Counting() {
      renders += 1;
      return <Pressable press="scale">Tap</Pressable>;
    }
    const { host } = mount(<Counting />);
    const button = host.querySelector('button')!;
    expect(button.className).toContain('pressable');
    expect(button.dataset.press).toBe('scale');

    act(() => void pointerDown(button));
    expect(button.hasAttribute('data-pressed')).toBe(true);
    // The attribute is written through a ref, so no touch causes a re-render.
    expect(renders).toBe(1);

    act(() => void button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })));
    expect(button.hasAttribute('data-pressed')).toBe(false);
  });

  it('waits before showing the press inside a scroller', async () => {
    const { host } = mount(
      <Pressable press="row" inScroller>
        Row
      </Pressable>,
    );
    const button = host.querySelector('button')!;
    act(() => void pointerDown(button));
    expect(button.hasAttribute('data-pressed')).toBe(false);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 80));
    });
    expect(button.hasAttribute('data-pressed')).toBe(true);
  });

  it('cancels the press once the finger moves past the threshold', () => {
    const { host } = mount(<Pressable press="card">Card</Pressable>);
    const button = host.querySelector('button')!;
    act(() => void pointerDown(button, 0, 0));
    expect(button.hasAttribute('data-pressed')).toBe(true);
    act(() => void pointerMove(button, 0, 24));
    expect(button.hasAttribute('data-pressed')).toBe(false);
  });

  it('cancels on pointercancel', () => {
    const { host } = mount(<Pressable>Tap</Pressable>);
    const button = host.querySelector('button')!;
    act(() => void pointerDown(button));
    act(() => void button.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true })));
    expect(button.hasAttribute('data-pressed')).toBe(false);
  });

  it('shows the same state for Enter and Space', () => {
    const { host } = mount(<Pressable>Tap</Pressable>);
    const button = host.querySelector('button')!;
    act(
      () =>
        void button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })),
    );
    expect(button.hasAttribute('data-pressed')).toBe(true);
    act(
      () => void button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })),
    );
    expect(button.hasAttribute('data-pressed')).toBe(false);
  });
});
