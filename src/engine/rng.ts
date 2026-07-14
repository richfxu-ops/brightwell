// rng.ts — the run's dice, carried in the state (D-008 rule 1: same seed, same run).
// Pure: a draw never mutates; it returns the value plus the advanced RngState.

export interface RngState {
  readonly seed: number;
  readonly counter: number;
}

// splitmix32-style hash of (seed, counter) — every draw is a pure function of both,
// so replaying a serialized state replays its randomness exactly.
function hash(seed: number, counter: number): number {
  let t = (seed ^ Math.imul(counter + 1, 0x9e3779b9)) >>> 0;
  t = Math.imul(t ^ (t >>> 16), 0x21f0aaad);
  t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
  return (t ^ (t >>> 15)) >>> 0;
}

/** Uniform float in [0, 1). */
export function next(rng: RngState): [number, RngState] {
  const value = hash(rng.seed, rng.counter) / 0x1_0000_0000;
  return [value, { seed: rng.seed, counter: rng.counter + 1 }];
}

/** Uniform integer in [0, maxExclusive). */
export function nextInt(rng: RngState, maxExclusive: number): [number, RngState] {
  const [value, advanced] = next(rng);
  return [Math.floor(value * maxExclusive), advanced];
}
