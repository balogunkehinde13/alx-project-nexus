export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem("guest_id");

  if (!id) {
    // Simple random ID
    id = "guest_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("guest_id", id);
  }

  return id;
}
