// Shared colours for the p5 "chalkboard" canvases.
// Keep in sync with the --color-board / --color-chalk tokens in app/globals.css.

export const BOARD = [37, 51, 45]; // dark slate-green chalkboard
export const BOARD_LIGHT = [51, 68, 61]; // raised areas on the board
export const CHALK = [241, 237, 226]; // chalk white
export const INK = [29, 35, 32]; // text on light tiles
export const HIGHLIGHT = [242, 193, 78]; // chalk yellow – the item being looked at
export const GOOD = [127, 209, 150]; // chalk green – found / in place
export const BAD = [240, 128, 104]; // chalk coral – removed / mismatch

const TILE_LOW = [246, 242, 233]; // small values: pale paper
const TILE_HIGH = [205, 180, 136]; // large values: warm tan

/**
 * Fill colour for a value tile: pale for small values, warmer for large ones.
 * @param P p5 instance
 * @param t position of the value in its range, 0..1
 * @param alpha opacity 0..255
 */
export function tileColor(P, t, alpha = 255) {
  const k = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  return P.color(
    TILE_LOW[0] + (TILE_HIGH[0] - TILE_LOW[0]) * k,
    TILE_LOW[1] + (TILE_HIGH[1] - TILE_LOW[1]) * k,
    TILE_LOW[2] + (TILE_HIGH[2] - TILE_LOW[2]) * k,
    alpha
  );
}
