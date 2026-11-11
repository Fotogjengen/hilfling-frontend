/**
 * Removes browser cached password through some freaky ITK mechanism. We hate this, but we
 * cant do anything about it.
 */
export function clearBasicAuthCredentials(): void {
  const xhr = new XMLHttpRequest();
  const url = `${window.location.origin}/login?t=${Date.now()}`;
  xhr.open("GET", url, true, "logme", "out");
  xhr.send();
}
