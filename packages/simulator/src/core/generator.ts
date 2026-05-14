// Baseline values for each metric and station archetype
// Her metrik için ortalama değerler ve gürültü genişlikleri
interface MetricBaseline {
  base: number;
  noise: number;
  min: number;
  max: number;
}

const baselines: Record<string, MetricBaseline> = {
  cpu_usage: { base: 35, noise: 15, min: 5, max: 100 },
  memory_usage: { base: 45, noise: 20, min: 10, max: 100 },
  packet_loss: { base: 1, noise: 1, min: 0, max: 100 },
  latency: { base: 18, noise: 10, min: 1, max: 1000 },
  rssi: { base: -50, noise: 15, min: -100, max: -20 },
  connected_users: { base: 250, noise: 150, min: 0, max: 1500 },
};

// Generate a random value within the baseline range
// Belirlenen aralıkta rastgele bir değer üret
function randomInRange(base: number, noise: number, min: number, max: number): number {
  const value = base + (Math.random() * 2 - 1) * noise;
  return Math.max(min, Math.min(max, value));
}

export interface GeneratedMetric {
  cpu_usage: number;
  memory_usage: number;
  packet_loss: number;
  latency: number;
  rssi: number;
  connected_users: number;
}

export function generateNormalMetric(): GeneratedMetric {
  return {
    cpu_usage: round(randomInRange(baselines.cpu_usage.base, baselines.cpu_usage.noise, baselines.cpu_usage.min, baselines.cpu_usage.max), 2),
    memory_usage: round(randomInRange(baselines.memory_usage.base, baselines.memory_usage.noise, baselines.memory_usage.min, baselines.memory_usage.max), 2),
    packet_loss: round(randomInRange(baselines.packet_loss.base, baselines.packet_loss.noise, baselines.packet_loss.min, baselines.packet_loss.max), 2),
    latency: round(randomInRange(baselines.latency.base, baselines.latency.noise, baselines.latency.min, baselines.latency.max), 2),
    rssi: round(randomInRange(baselines.rssi.base, baselines.rssi.noise, baselines.rssi.min, baselines.rssi.max), 2),
    connected_users: Math.round(randomInRange(baselines.connected_users.base, baselines.connected_users.noise, baselines.connected_users.min, baselines.connected_users.max)),
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}