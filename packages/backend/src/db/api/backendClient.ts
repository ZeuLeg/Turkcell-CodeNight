import axios from 'axios';

// Backend URL (Docker'da değil, local'de çalışıyor)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export const backendClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 3000, // Polling süresini aşmaması için timeout kısa tutulmalı
});

export const sendMetricsToBackend = async (stationId: string, metrics: any) => {
  try {
    await backendClient.post(`/stations/${stationId}/metrics`, metrics);
  } catch (error) {
    // Network koptuğunda simülatörün çökmemesi için hatayı yutuyoruz
    console.error(`[Backend Client] Failed to send metrics for station ${stationId}`);
  }
};