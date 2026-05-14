import { useState, useEffect } from 'react';
import { MetricChart } from './MetricChart';

const generateInitialData = (baseValue: number, variance: number) => {
  return Array.from({ length: 20 }).map((_, i) => ({
    time: i.toString(),
    value: Math.max(0, Math.min(100, baseValue + (Math.random() * variance * 2 - variance)))
  }));
};

export function MetricChartsGrid() {
  const [data, setData] = useState({
    cpu: generateInitialData(45, 5),
    memory: generateInitialData(60, 2),
    packetLoss: generateInitialData(0.5, 0.5),
    latency: generateInitialData(25, 5),
    rssi: generateInitialData(70, 3), // we use positive numbers for simplicity in chart domain 0-100, though RSSI is usually negative
    users: generateInitialData(450, 20),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const nextTime = new Date().toLocaleTimeString();
        
        const getNext = (arr: any[], variance: number) => {
          const lastVal = arr[arr.length - 1].value;
          const nextVal = Math.max(0, Math.min(100, lastVal + (Math.random() * variance * 2 - variance)));
          return [...arr.slice(1), { time: nextTime, value: Math.round(nextVal * 10) / 10 }];
        };

        const getNextUsers = (arr: any[]) => {
          const lastVal = arr[arr.length - 1].value;
          const nextVal = Math.max(0, lastVal + Math.floor(Math.random() * 10 - 5));
          return [...arr.slice(1), { time: nextTime, value: nextVal }];
        };

        return {
          cpu: getNext(prev.cpu, 5),
          memory: getNext(prev.memory, 2),
          packetLoss: getNext(prev.packetLoss, 0.5),
          latency: getNext(prev.latency, 5),
          rssi: getNext(prev.rssi, 3),
          users: getNextUsers(prev.users),
        };
      });
    }, 1500); // Update every 1.5s for live feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricChart title="CPU Kullanımı" data={data.cpu} dataKey="value" color="#3b82f6" unit="%" />
      <MetricChart title="Bellek (RAM)" data={data.memory} dataKey="value" color="#8b5cf6" unit="%" />
      <MetricChart title="Paket Kaybı" data={data.packetLoss} dataKey="value" color="#ef4444" unit="%" domain={[0, 5]} />
      <MetricChart title="Gecikme (Latency)" data={data.latency} dataKey="value" color="#f59e0b" unit="ms" domain={[0, 100]} />
      <MetricChart title="Sinyal Kalitesi (RSSI Yüzdesi)" data={data.rssi} dataKey="value" color="#10b981" unit="%" />
      <MetricChart title="Bağlı Kullanıcılar" data={data.users} dataKey="value" color="#6366f1" unit=" Kişi" domain={[0, 1000]} />
    </div>
  );
}

