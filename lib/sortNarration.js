// Narration for the sorting animations.
//
// The sorting sketches queue their animation as stages on a Tideon Animator
// while the algorithm runs. The narrator adds tiny extra stages in between, so
// that exactly when the animation reaches a step, the page is told which
// pseudocode line is running, what is happening in plain words, and the
// running counters (comparisons, swaps, ...).
//
//   const narr = createNarrator(animator, onNarrateRef);
//   narr.say([2, 3], "Compare 5 and 3", { comparisons: 1 });
//   narr.run(() => (box.done = true));   // state change in sync with the animation
//   narr.pause(30);                      // hold a moment so a caption can be read

export function createNarrator(animator, emitRef, opts = {}) {
  let stats = { ...(opts.stats || {}) };

  function stage(fn) {
    animator.addStage({
      func: () => animator.animationSequence([animator.animateFunc(1, fn)]),
    });
  }

  return {
    /** Highlight pseudocode `lines` and show `text`; `delta` adds to the counters. */
    say(lines, text, delta = {}, extra = {}) {
      Object.entries(delta).forEach(([k, v]) => {
        stats[k] = (stats[k] || 0) + v;
      });
      const payload = { lines: [].concat(lines), text, stats: { ...stats }, ...extra };
      stage(() => emitRef.current?.(payload));
    },
    /** Run a state change (colour a box, move a label) when the animation gets here. */
    run(fn) {
      stage(fn);
    },
    /** Hold for a number of frames, scaled by the speed slider like every other delay. */
    pause(frames) {
      animator.addStage({ func: () => animator.animationSequence([animator.delay(frames)]) });
    },
    /** Start counting from zero again (a new array was submitted). */
    reset(initial = opts.stats || {}) {
      stats = { ...initial };
    },
    get stats() {
      return { ...stats };
    },
  };
}

/** Shared look for array boxes: green when final, outlined when in a sorted part, a tag above. */
export function drawBoxState(P, box, { size = 60, cx = box.x, cy = box.y, colors, tagBelow = false }) {
  const { GOOD, HIGHLIGHT, CHALK } = colors;
  P.push();
  P.rectMode(P.CENTER);
  if (box.part && !box.done) {
    P.noFill();
    P.stroke(GOOD[0], GOOD[1], GOOD[2], box.opacity * 0.9);
    P.strokeWeight(3);
    P.rect(cx, cy, size + 8, size + 8, 4);
  }
  if (box.tag) {
    P.noStroke();
    P.fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], box.opacity);
    P.textSize(13);
    P.textStyle(P.BOLD);
    if (tagBelow) {
      P.textAlign(P.CENTER, P.TOP);
      P.text(box.tag, cx, cy + size / 2 + 6);
    } else {
      P.textAlign(P.CENTER, P.BOTTOM);
      P.text(box.tag, cx, cy - size / 2 - 8);
    }
  }
  if (box.done) {
    P.noStroke();
    P.fill(CHALK[0], CHALK[1], CHALK[2], box.opacity * 0.85);
    P.textAlign(P.CENTER, P.TOP);
    P.textSize(12);
    P.text("✔", cx, cy + size / 2 + 4);
  }
  P.pop();
}
