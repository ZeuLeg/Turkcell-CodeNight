import { useState, useEffect } from 'react';
import { MetricChart } from './MetricChart';
import { stationsApi } from '@/api/stations.api';
import { Metric } from '@/types/station.types';

const generateInitialData = (baseValue: number, variance: number, count = 20, min = 0, max = 100) =>
  Array.from({ length: count }).map((_, i) => ({
    time: i.toString(),
    value: Math.round((Math.min(max, Math.max(min, baseValue + (Math.random() * variance * 2 - variance))) * 10) / 10),
  }));

const round1 = (n: number) => Math.round(n * 10) / 10;
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const nowStr = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

type ChartPoint = { time: string; value: number };
type ChartData = { cpu: ChartPoint[]; memory: ChartPoint[]; packetLoss: ChartPoint[]; latency: ChartPoint[]; rssi: ChartPoint[]; users: ChartPoint[] };

function buildFromHistory(history: Metric[]): ChartData {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).slice(-20);
  const toPoints = (fn: (m: Metric) => number): ChartPoint[] =>
    sorted.map(m => ({ time: fmtTime(m.timestamp), value: round1(fn(m)) }));
  return {
    cpu:        toPoints(m => parseFloat(m.cpuUsage)),
    memory:     toPoints(m => parseFloat(m.memoryUsage)),
    packetLoss: toPoints(m => parseFloat(m.packetLoss)),
    latency:    toPoints(m => parseFloat(m.latency)),
    rssi:       toPoints(m => parseFloat(m.rssi)),
    users:      toPoints(m => m.connectedUsers),
  };
}

interface Props {
  stationId?: string;
}

export function MetricChartsGrid({ stationId }: Props) {
  const [data, setData] = useState<ChartData>({
    cpu:        generateInitialData(38,   8,  20,   0,  100),
    memory:     generateInitialData(55,   5,  20,   0,  100),
    packetLoss: generateInitialData(1.2,  0.8, 20,  0,   15),
    latency:    generateInitialData(22,   6,  20,   0,  120),
    rssi:       generateInitialData(-52,  8,  20, -95,  -20),
    users:      generateInitialData(380, 30,  20,   0, 1000),
  });

  useEffect(() => {
    if (!stationId) {
      // Simulated mode (dashboard)
      const interval = setInterval(() => {
        setData((prev) => {
          const t = nowStr();
          const shift = (arr: ChartPoint[], variance: number, min: number, max: number) => {
            const last = arr[arr.length - 1].value;
            const next = Math.min(max, Math.max(min, last + (Math.random() * variance * 2 - variance)));
            return [...arr.slice(1), { time: t, value: round1(next) }];
          };
          return {
            cpu:        shift(prev.cpu,        6,    0,  100),
            memory:     shift(prev.memory,     3,    0,  100),
            packetLoss: shift(prev.packetLoss, 0.5,  0,   15),
            latency:    shift(prev.latency,    5,    0,  120),
            rssi:       shift(prev.rssi,       4,  -95,  -20),
            users:      shift(prev.users,      15,   0, 1000),
          };
        });
      }, 2000);
      return () => clearInterval(interval);
    }

    // Real metrics mode (station detail): load history first, then poll for new points
    stationsApi.getMetrics(stationId)
      .then((res) => { if (res.data?.length) setData(buildFromHistory(res.data)); })
      .catch(() => {});

    const fetchLatest = () => {
      stationsApi.getLatestMetric(stationId).then((res) => {
        const m = res.data;
        if (!m) return;
        const t = fmtTime(m.timestamp);
        const push = (arr: ChartPoint[], val: number) => [...arr.slice(1), { time: t, value: round1(val) }];
        setData((prev) => ({
          cpu:        push(prev.cpu,        parseFloat(m.cpuUsage)),
          memory:     push(prev.memory,     parseFloat(m.memoryUsage)),
          packetLoss: push(prev.packetLoss, parseFloat(m.packetLoss)),
          latency:    push(prev.latency,    parseFloat(m.latency)),
          rssi:       push(prev.rssi,       parseFloat(m.rssi)),
          users:      push(prev.users,      m.connectedUsers),
        }));
      }).catch(() => {});
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, [stationId]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricChart title="CPU Kullanımı" data={data.cpu} dataKey="value" color="#3b82f6" unit="%" domain={[0, 100]} thresholds={{ warning: 75, critical: 90 }} />
      <MetricChart title="Bellek (RAM)" data={data.memory} dataKey="value" color="#8b5cf6" unit="%" domain={[0, 100]} thresholds={{ warning: 80, critical: 95 }} />
      <MetricChart title="Paket Kaybı" data={data.packetLoss} dataKey="value" color="#ef4444" unit="%" domain={[0, 15]} thresholds={{ warning: 5, critical: 10 }} />
      <MetricChart title="Gecikme (Latency)" data={data.latency} dataKey="value" color="#f59e0b" unit=" ms" domain={[0, 120]} thresholds={{ warning: 50, critical: 100 }} />
      <MetricChart title="Sinyal Gücü (RSSI)" data={data.rssi} dataKey="value" color="#10b981" unit=" dBm" domain={[-100, -20]} thresholds={{ warning: -80, critical: -90 }} thresholdDirection="below" />
      <MetricChart title="Bağlı Kullanıcılar" data={data.users} dataKey="value" color="#6366f1" unit="" domain={[0, 1000]} thresholds={{ warning: 800, critical: 950 }} />
    </div>
  );
}
