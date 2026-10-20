/**
 * Removes browser cached password through some freaky ITK mechanism. We hate this, but we
 * cant do anything about it.
 */
export function clearBasicAuthCredentials(): void {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/auth/login", true, "logme", "out");
  xhr.send();
}
