import { describe, it, expect } from 'vitest';
import { randomInt, randomFloat, randomGaussian } from '../src/utils/math';

describe('Math Utils', () => {
  it('randomInt belirtilen sınırlar içinde değer üretmeli', () => {
    const val = randomInt(1, 10);
    expect(val).toBeGreaterThanOrEqual(1);
    expect(val).toBeLessThanOrEqual(10);
  });

  it('randomFloat belirtilen sınırlar içinde ondalık değer üretmeli', () => {
    const val = randomFloat(1.5, 5.5);
    expect(val).toBeGreaterThanOrEqual(1.5);
    expect(val).toBeLessThanOrEqual(5.5);
  });

  it('randomGaussian ortalama değer civarında dağılım üretmeli', () => {
    const val = randomGaussian(100, 10); // mean 100, stdDev 10
    // İhtimal çok düşük de olsa geniş bir sınır koyarak kontrol edelim (99.7% chance for +/- 3 stddev)
    expect(val).toBeGreaterThan(50);
    expect(val).toBeLessThan(150);
  });
});
