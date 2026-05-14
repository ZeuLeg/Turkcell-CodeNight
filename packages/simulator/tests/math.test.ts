import { describe, it, expect } from 'vitest';
import { randomInt, randomFloat, clamp } from '../src/utils/math';

// Not: Projeye vitest veya jest gibi bir test aracı eklediğinizde bu dosyayı çalıştırabilirsiniz.
// Şimdilik sadece örnek bir test yapısı kurulmuştur.

describe('Math Utils', () => {
  it('randomInt belirtilen sınırlar içinde değer üretmeli', () => {
    const val = randomInt(1, 10);
    expect(val).toBeGreaterThanOrEqual(1);
    expect(val).toBeLessThanOrEqual(10);
  });

  it('clamp değeri sınırlandırmalı', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
