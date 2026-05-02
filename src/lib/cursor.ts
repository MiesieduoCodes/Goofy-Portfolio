export function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  let x = 0;
  let y = 0;

  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;

    cursor.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  });

  // grow on hover
  const hoverables = document.querySelectorAll("a, button, .hoverable");

  hoverables.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.addEventListener("mouseenter", () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      const hex = document.querySelector("#cursor-hex-svg polygon") as SVGPolygonElement;
      if (hex) hex.style.fill = "white";
    });

    htmlEl.addEventListener("mouseleave", () => {
      cursor.style.width = "22px";
      cursor.style.height = "22px";
      const hex = document.querySelector("#cursor-hex-svg polygon") as SVGPolygonElement;
      if (hex) hex.style.fill = "transparent";
    });
  });

  // Magnetic hover effect
  const magnets = document.querySelectorAll(".magnetic");

  magnets.forEach((magnet) => {
    const htmlMagnet = magnet as HTMLElement;
    htmlMagnet.addEventListener("mousemove", (e) => {
      const mouseEvent = e as MouseEvent;
      const rect = htmlMagnet.getBoundingClientRect();
      const mx = mouseEvent.clientX - rect.left - rect.width / 2;
      const my = mouseEvent.clientY - rect.top - rect.height / 2;

      htmlMagnet.style.transform = `translate(${mx * 0.2}px, ${my * 0.2}px)`;
    });

    htmlMagnet.addEventListener("mouseleave", () => {
      htmlMagnet.style.transform = "translate(0,0)";
    });
  });
}
