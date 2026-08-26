-- Custom SQL migration file, put your code below! --

-- Public marketing site: enquiry staging, newsletter subscribers, saved listings.
--
-- Hand-written rather than generated. `drizzle-kit generate` cannot run
-- non-interactively here: its enum resolver prompts for a TTY because the
-- snapshot chain in meta/ has drifted from the schema by eight enums that
-- predate this change (valuation_stage, maintenance_category,
-- pipeline_lead_priority, report_cadence, service_health_status,
-- support_ticket_channel, job_run_status added; valuation_status and
-- valuation_type removed). Regenerating would emit that pre-existing drift as
-- part of this migration and try to recreate objects the database already has.
-- The .sql files are the source of truth here — 0032 is hand-written too — so
-- this follows them. The snapshot drift is worth repairing separately with an
-- introspect against a live database.

CREATE TYPE "public"."web_enquiry_kind" AS ENUM('viewing', 'valuation', 'contact');--> statement-breakpoint
CREATE TYPE "public"."web_enquiry_status" AS ENUM('new', 'triaged', 'converted', 'spam', 'archived');--> statement-breakpoint
CREATE TYPE "public"."web_subscriber_status" AS ENUM('pending', 'confirmed', 'unsubscribed', 'bounced');--> statement-breakpoint

CREATE TABLE "web_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	-- Nullable unlike every internal table: an anonymous visitor belongs to no
	-- entity until triage assigns one.
	"entity_id" uuid,
	"kind" "web_enquiry_kind" NOT NULL,
	"status" "web_enquiry_status" DEFAULT 'new' NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"message" text,
	"property_id" uuid,
	"area_slug" text,
	"preferred_date" text,
	"preferred_slot" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"source_path" text,
	-- Hashed, not raw. The throttle only needs "same origin as a moment ago",
	-- and a raw IP is personal data with a retention obligation attached.
	"ip_hash" text,
	"user_agent" text,
	"converted_lead_id" uuid,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "web_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" "web_subscriber_status" DEFAULT 'pending' NOT NULL,
	"confirm_token" text,
	"confirm_token_expires_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	-- No expiry, deliberately: a one-click unsubscribe that has stopped
	-- working is worse than none.
	"unsubscribe_token" text NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"source" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "user_saved_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

ALTER TABLE "web_enquiries" ADD CONSTRAINT "web_enquiries_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_enquiries" ADD CONSTRAINT "web_enquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_enquiries" ADD CONSTRAINT "web_enquiries_converted_lead_id_leads_id_fk" FOREIGN KEY ("converted_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "web_enquiries" ADD CONSTRAINT "web_enquiries_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Cascades on both: a saved listing is a bookmark, and a bookmark pointing at
-- a deleted user or a delisted property is not worth keeping.
ALTER TABLE "user_saved_listings" ADD CONSTRAINT "user_saved_listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_listings" ADD CONSTRAINT "user_saved_listings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

CREATE INDEX "web_enquiries_status_idx" ON "web_enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "web_enquiries_kind_idx" ON "web_enquiries" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "web_enquiries_created_at_idx" ON "web_enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "web_enquiries_ip_hash_idx" ON "web_enquiries" USING btree ("ip_hash");--> statement-breakpoint

-- Addresses are case-folded at the application boundary before insert, so this
-- unique index is the real guarantee that one address appears once.
CREATE UNIQUE INDEX "web_subscribers_email_idx" ON "web_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "web_subscribers_status_idx" ON "web_subscribers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "web_subscribers_confirm_token_idx" ON "web_subscribers" USING btree ("confirm_token");--> statement-breakpoint
CREATE UNIQUE INDEX "web_subscribers_unsubscribe_token_idx" ON "web_subscribers" USING btree ("unsubscribe_token");--> statement-breakpoint

-- Saving twice is the same as saving once. The unique index makes the action
-- idempotent at the database rather than in a read-then-write race.
CREATE UNIQUE INDEX "user_saved_listings_user_property_idx" ON "user_saved_listings" USING btree ("user_id","property_id");--> statement-breakpoint
CREATE INDEX "user_saved_listings_user_idx" ON "user_saved_listings" USING btree ("user_id");--> statement-breakpoint

-- ── The Website system user ──
--
-- Public submissions have no authenticated caller, but activity_logs.actor_id
-- is NOT NULL and the whole ERP relies on that. Rather than loosen the
-- constraint, external data entering the system is attributed to one real user
-- that exists for exactly this purpose, so the audit trail stays complete and
-- honest about where a row came from.
--
-- The password hash is a deliberately invalid placeholder: bcrypt hashes start
-- with $2, so this value can never match a real password and the account
-- cannot be signed into. is_active is false for the same reason.
INSERT INTO "users" ("email", "password_hash", "name", "role", "title", "is_active")
SELECT 'website@sunland.co.ke', '$disabled$website-system-account', 'Website', 'front_office_admin', 'Public website', false
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE "email" = 'website@sunland.co.ke');
