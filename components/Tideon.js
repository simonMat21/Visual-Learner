// Tideon.js
// Thin wrapper around the published Tideon animation library.
// The engine itself lives in the npm package "@simonmat21/tideon.js";
// this file only adds the small helpers the visualizers rely on so that
// existing imports from "@/components/Tideon" keep working.

export { Animator, htmlToObj } from "@simonmat21/tideon.js";

/**
 * Shorthand for building an animation target for Animator.animate/to.
 * @param {object} obj Object whose properties are animated
 * @param {number} x Target (for `to`) or delta (for `animate`) x
 * @param {number} y Target (for `to`) or delta (for `animate`) y
 * @param {number} opacity Target (for `to`) or delta (for `animate`) opacity
 */
export function a2o(obj, x, y, opacity) {
  return {
    obj,
    changes: { x, y, opacity },
  };
}
