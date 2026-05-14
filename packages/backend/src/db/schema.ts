import {
  pgTable, uuid, varchar, decimal, integer,
  timestamp, text, pgEnum, bigserial, index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUM'lar (PDF Sayfa 8)
export const stationTypeEnum = pgEnum('station_type', ['LTE', 'NR_5G']);
export const stationStatusEnum = pgEnum('station_status', ['ACTIVE', 'WARNING', 'CRITICAL', 'OFFLINE']);
export const alarmSeverityEnum = pgEnum('alarm_severity', ['WARNING', 'CRITICAL']);
export const alarmStatusEnum = pgEnum('alarm_status', ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED']);

// BAZ İSTASYONLARI
export const stations = pgTable('stations', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 20 }).notNull().unique(), // BSC-001 formatı
  name: varchar('name', { length: 200 }).notNull(),
  latitude: decimal('latitude').notNull(),
  longitude: decimal('longitude').notNull(),
  region: varchar('region', { length: 50 }).notNull(),
  type: stationTypeEnum('type').notNull(),
  capacity: integer('capacity').notNull(),
  status: stationStatusEnum('status').notNull().default('ACTIVE'),
});

// ZAMAN SERİSİ METRİKLERİ
export const metrics = pgTable('metrics', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  stationId: uuid('station_id').references(() => stations.id).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  cpuUsage: decimal('cpu_usage', { precision: 5, scale: 2 }).notNull(),
  memoryUsage: decimal('memory_usage', { precision: 5, scale: 2 }).notNull(),
  packetLoss: decimal('packet_loss', { precision: 5, scale: 2 }).notNull(),
  latency: decimal('latency', { precision: 8, scale: 2 }).notNull(),
  rssi: decimal('rssi', { precision: 6, scale: 2 }).notNull(),
  connectedUsers: integer('connected_users').notNull(),
}, (table) => {
  return {
    stationTimestampIdx: index('station_timestamp_idx').on(table.stationId, table.timestamp),
  };
});

// KULLANICILAR (Auth ve Atama için)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // NOC, FIELD_ENGINEER, ADMIN
});

// ALARMLAR
export const alarms = pgTable('alarms', {
  id: uuid('id').primaryKey().defaultRandom(),
  stationId: uuid('station_id').references(() => stations.id).notNull(),
  metricName: varchar('metric_name', { length: 50 }).notNull(), // Hangi metrik tetikledi
  severity: alarmSeverityEnum('severity').notNull(),
  status: alarmStatusEnum('status').notNull().default('OPEN'),
  message: text('message').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id), // Saha mühendisi FK
  resolutionNote: text('resolution_note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

// EŞİK DEĞERLERİ (Hard-coded olmaması için)
export const thresholdConfigs = pgTable('threshold_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  metricName: varchar('metric_name', { length: 50 }).notNull().unique(),
  warningThreshold: decimal('warning_threshold').notNull(),
  criticalThreshold: decimal('critical_threshold').notNull(),
  direction: varchar('direction', { length: 10 }).notNull(), // 'above' veya 'below'
  isActive: integer('is_active').default(1).notNull() // 1: Aktif, 0: Pasif
});

// ALARMLAR VE İSTASYONLAR ARASINDAKİ İLİŞKİ
export const alarmsRelations = relations(alarms, ({ one }) => ({
  station: one(stations, {
    fields: [alarms.stationId],
    references: [stations.id],
  }),
}));