import { describe, it, expect } from "vitest";
import { next, nextInt, type RngState } from "./rng.js";

function drawMany(seed: number, n: number): number[] {
  let rng: RngState = { seed, counter: 0 };
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const [v, advanced] = next(rng);
    out.push(v);
    rng = advanced;
  }
  return out;
}

describe("rng (D-008 rule 1: same seed, same run)", () => {
  it("same seed gives the identical sequence", () => {
    expect(drawMany(42, 50)).toEqual(drawMany(42, 50));
  });

  it("different seeds give different sequences", () => {
    expect(drawMany(42, 50)).not.toEqual(drawMany(43, 50));
  });

  it("drawing never mutates — replaying a serialized state replays its randomness", () => {
    const rng: RngState = { seed: 7, counter: 12 };
    const [a] = next(rng);
    const [b] = next(rng);
    expect(a).toBe(b);
    expect(rng.counter).toBe(12);
  });

  it("values stay in range", () => {
    let rng: RngState = { seed: 99, counter: 0 };
    for (let i = 0; i < 200; i++) {
      const [v, advanced] = next(rng);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      rng = advanced;
    }
    const [n] = nextInt({ seed: 5, counter: 0 }, 10);
    expect(Number.isInteger(n)).toBe(true);
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThan(10);
  });
});
