/**
 * Belirli bir aralıkta rastgele tam sayı üretir
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Belirli bir aralıkta rastgele ondalıklı sayı üretir
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Normal (Gaussian) Dağılımına uygun rastgele sayı üretir.
 * Box-Muller dönüşümü kullanır.
 * 
 * @param mean Ortalama değer
 * @param stdDev Standart sapma
 */
export function randomGaussian(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // [0,1) arası üretilir, 0 istenmez
  while(v === 0) v = Math.random();
  
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

/**
 * Belirli bir değerin belirtilen min/max sınırları içinde kalmasını sağlar
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
