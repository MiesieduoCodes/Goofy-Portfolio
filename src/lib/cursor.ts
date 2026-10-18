// Custom hexagon cursor. Uses event delegation so links and buttons rendered
// after the first page load (client navigation, Firestore data) still react.
export function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return () => {};

  // Touch-only devices have no pointer to follow
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    cursor.style.display = "none";
    return () => {};
  }

  const hex = document.querySelector("#cursor-hex-svg polygon") as SVGPolygonElement | null;

  const onMove = (e: MouseEvent) => {
    cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  };

  // grow on hover
  const onOver = (e: MouseEvent) => {
    const target = (e.target as Element | null)?.closest?.("a, button, .hoverable");
    cursor.style.width = target ? "40px" : "22px";
    cursor.style.height = target ? "40px" : "22px";
    if (hex) hex.style.fill = target ? "white" : "transparent";
  };

  // Magnetic hover effect
  let magnet: HTMLElement | null = null;
  const onMagnetMove = (e: MouseEvent) => {
    const next = (e.target as Element | null)?.closest?.(".magnetic") as HTMLElement | null;
    if (magnet && magnet !== next) magnet.style.transform = "translate(0,0)";
    magnet = next;
    if (!magnet) return;
    const rect = magnet.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    magnet.style.transform = `translate(${mx * 0.2}px, ${my * 0.2}px)`;
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mousemove", onMagnetMove);
  document.addEventListener("mouseover", onOver);

  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mousemove", onMagnetMove);
    document.removeEventListener("mouseover", onOver);
  };
}
