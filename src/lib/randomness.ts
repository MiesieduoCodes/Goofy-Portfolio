export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const easings = [
  "power1.out",
  "power2.out",
  "power3.out",
  "power4.out",
  "back.out(1.7)",
  "expo.out",
];
