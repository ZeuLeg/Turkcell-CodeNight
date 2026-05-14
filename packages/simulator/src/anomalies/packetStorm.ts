import type { GeneratedMetric } from '../core/generator.js';

// Packet loss fluctuates above 15 percent threshold
// Paket kaybı yüzde 15 eşiği üstünde dalgalanır
export function applyPacketStorm(metric: GeneratedMetric): GeneratedMetric {
  const fluctuation = Math.random();
  let packetLoss: number;
  if (fluctuation < 0.3) {
    packetLoss = 8 + Math.random() * 6;
  } else {
    packetLoss = 15 + Math.random() * 15;
  }
  return {
    ...metric,
    packet_loss: Math.round(packetLoss * 100) / 100,
  };
}