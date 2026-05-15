import { create } from 'zustand';

export interface ActiveAnomaly {
  id: string;
  stationId: string;
  stationName?: string;
  type: string;
  startTime: number;
  endTime: number;
}

interface SimulatorState {
  isRunning: boolean;
  activeAnomalies: ActiveAnomaly[];
  setRunning: (running: boolean) => void;
  addAnomaly: (anomaly: ActiveAnomaly) => void;
  removeAnomaly: (id: string) => void;
  pruneExpired: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  isRunning: false,
  activeAnomalies: [],
  setRunning: (running) => set({ isRunning: running }),
  addAnomaly: (anomaly) =>
    set((state) => ({ activeAnomalies: [...state.activeAnomalies, anomaly] })),
  removeAnomaly: (id) =>
    set((state) => ({ activeAnomalies: state.activeAnomalies.filter((a) => a.id !== id) })),
  pruneExpired: () =>
    set((state) => ({ activeAnomalies: state.activeAnomalies.filter((a) => a.endTime > Date.now()) })),
}));
