CREATE TYPE "public"."alarm_severity" AS ENUM('WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."alarm_status" AS ENUM('OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."station_status" AS ENUM('ACTIVE', 'WARNING', 'CRITICAL', 'OFFLINE');--> statement-breakpoint
CREATE TYPE "public"."station_type" AS ENUM('LTE', 'NR_5G');--> statement-breakpoint
CREATE TABLE "alarms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" uuid NOT NULL,
	"metric_name" varchar(50) NOT NULL,
	"severity" "alarm_severity" NOT NULL,
	"status" "alarm_status" DEFAULT 'OPEN' NOT NULL,
	"message" text NOT NULL,
	"assigned_to" uuid,
	"resolution_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"station_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"cpu_usage" numeric(5, 2) NOT NULL,
	"memory_usage" numeric(5, 2) NOT NULL,
	"packet_loss" numeric(5, 2) NOT NULL,
	"latency" numeric(8, 2) NOT NULL,
	"rssi" numeric(6, 2) NOT NULL,
	"connected_users" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(200) NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"region" varchar(50) NOT NULL,
	"type" "station_type" NOT NULL,
	"capacity" integer NOT NULL,
	"status" "station_status" DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "stations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "threshold_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_name" varchar(50) NOT NULL,
	"warning_threshold" numeric NOT NULL,
	"critical_threshold" numeric NOT NULL,
	"direction" varchar(10) NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "threshold_configs_metric_name_unique" UNIQUE("metric_name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "station_timestamp_idx" ON "metrics" USING btree ("station_id","timestamp");