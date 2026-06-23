let interacted = false;

function markInteracted() {
  interacted = true;
}

window.addEventListener("pointerdown", markInteracted, {
  capture: true,
  once: true,
});
window.addEventListener("keydown", markInteracted, {
  capture: true,
  once: true,
});

/**
 * Whether the user has interacted with the page since it loaded. False when a
 * component mounts as part of the initial page load (e.g. after a refresh).
 */
export const hasUserInteracted = () => interacted;
