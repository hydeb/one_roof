CREATE TYPE "public"."message_channel" AS ENUM('sms', 'email', 'in_app', 'voice');--> statement-breakpoint
CREATE TYPE "public"."message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('identity_doc', 'insurance_coi', 'w9', 'subcontractor_agreement', 'rate_sheet_addendum', 'estimate_pdf', 'invoice_pdf', 'job_photo_before', 'job_photo_progress', 'job_photo_after', 'leave_behind_pdf', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('customer', 'tenant', 'operator', 'subcontractor', 'contractor_independent', 'contractor_branded', 'contractor_master', 'contractor_member', 'property_manager', 'admin_vetting', 'admin_brand', 'admin_dispute', 'admin_marketplace', 'admin_super');--> statement-breakpoint
CREATE TYPE "public"."scope_type" AS ENUM('global', 'household', 'portfolio', 'company');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('single_family', 'condo', 'townhouse', 'multi_family', 'vacant_lot', 'commercial');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('ach', 'check', 'cash', 'zelle', 'venmo');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."rate_unit" AS ENUM('per_job', 'per_hour', 'per_sqft', 'per_unit');--> statement-breakpoint
CREATE TYPE "public"."subcontractor_status" AS ENUM('invited', 'onboarding', 'active', 'inactive', 'on_hold', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."job_event_type" AS ENUM('lead.created', 'lead.contacted', 'lead.message_sent', 'lead.message_received', 'lead.note_added', 'estimate.draft_started', 'estimate.sent', 'estimate.viewed', 'estimate.followup_sent', 'estimate.discussion', 'estimate.changed', 'job.scheduled', 'job.rescheduled', 'job.deposit_paid', 'job.subcontractor_assigned', 'job.subcontractor_unassigned', 'job.in_progress', 'job.paused', 'job.completed', 'job.cancelled', 'invoice.sent', 'invoice.viewed', 'invoice.paid', 'invoice.partial_paid', 'review.requested', 'review.received', 'dispute.opened', 'dispute.resolved', 'lost.marked');--> statement-breakpoint
CREATE TYPE "public"."job_source" AS ENUM('door_knock', 'facebook', 'referral', 'realtor_pm', 'web', 'phone', 'repeat', 'home_doctor', 'walk_in', 'other');--> statement-breakpoint
CREATE TYPE "public"."lost_reason" AS ENUM('price', 'timing', 'went_with_competitor', 'no_response', 'scope_changed', 'other');--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('new_lead', 'contacted', 'estimate_sent', 'proposal_followup', 'booked_scheduled', 'completed_won', 'lost');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reason" text,
	"ip_address" text,
	"user_agent" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_inbox" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"schema_version" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"processing_attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"destination" text NOT NULL,
	"payload" jsonb NOT NULL,
	"schema_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"processing_attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel" "message_channel" NOT NULL,
	"direction" "message_direction" NOT NULL,
	"customer_id" uuid,
	"job_id" uuid,
	"user_id" uuid,
	"body" text,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"external_id" text,
	"external_status" text,
	"from_address" text,
	"to_address" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"full_name" text,
	"phone" text,
	"email" text,
	"customer_score" integer,
	"total_jobs_completed" integer DEFAULT 0 NOT NULL,
	"total_revenue" numeric(12, 2) DEFAULT '0' NOT NULL,
	"last_job_at" timestamp with time zone,
	"first_job_at" timestamp with time zone,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"acquisition_source" text,
	"acquisition_detail" text,
	"acquired_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_type" "document_type" NOT NULL,
	"blob_url" text NOT NULL,
	"blob_pathname" text NOT NULL,
	"content_type" text NOT NULL,
	"file_size_bytes" integer NOT NULL,
	"original_filename" text,
	"customer_id" uuid,
	"property_id" uuid,
	"subcontractor_id" uuid,
	"job_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"uploaded_by_user_id" uuid,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" timestamp with time zone,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"phone" text,
	"phone_verified_at" timestamp with time zone,
	"full_name" text,
	"preferred_name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role_grant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"scope_type" "scope_type" NOT NULL,
	"scope_id" uuid,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"granted_by_user_id" uuid,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "household" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"portfolio_id" uuid,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"homedoctor_household_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"latitude" text,
	"longitude" text,
	"property_type" "property_type",
	"year_built" integer,
	"square_feet" integer,
	"bedrooms" integer,
	"bathrooms" text,
	"access_notes" text,
	"primary_contact_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcontractor_payout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subcontractor_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"job_count" integer NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"reference_number" text,
	"paid_at" timestamp with time zone,
	"failed_reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcontractor_payout_job" (
	"payout_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	CONSTRAINT "subcontractor_payout_job_payout_id_job_id_pk" PRIMARY KEY("payout_id","job_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcontractor_rate_sheet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subcontractor_id" uuid NOT NULL,
	"service_key" text NOT NULL,
	"rate_amount" numeric(10, 2) NOT NULL,
	"rate_unit" "rate_unit" DEFAULT 'per_job' NOT NULL,
	"scope_constraints" text,
	"notes" text,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcontractor_roster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"full_name" text NOT NULL,
	"business_name" text,
	"phone" text NOT NULL,
	"email" text,
	"mailing_address_line_1" text,
	"mailing_address_line_2" text,
	"mailing_city" text,
	"mailing_state" text,
	"mailing_postal_code" text,
	"trade_categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"identity_doc_id" uuid,
	"insurance_coi_doc_id" uuid,
	"insurance_expires_at" date,
	"w9_doc_id" uuid,
	"signed_agreement_doc_id" uuid,
	"agreement_signed_at" timestamp with time zone,
	"payment_method" "payment_method" DEFAULT 'ach' NOT NULL,
	"banking_details_encrypted" text,
	"status" "subcontractor_status" DEFAULT 'invited' NOT NULL,
	"status_reason" text,
	"notes" text,
	"total_jobs_completed" integer DEFAULT 0 NOT NULL,
	"total_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"last_job_at" timestamp with time zone,
	"pre_existing_customers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"added_by_user_id" uuid,
	"terminated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pipeline_stage" "pipeline_stage" DEFAULT 'new_lead' NOT NULL,
	"lost_at" timestamp with time zone,
	"lost_reason" "lost_reason",
	"lost_notes" text,
	"customer_id" uuid NOT NULL,
	"property_id" uuid,
	"requested_services" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"initial_photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source" "job_source" NOT NULL,
	"source_detail" text,
	"estimate_amount" numeric(10, 2),
	"estimate_line_items" jsonb,
	"estimate_sent_at" timestamp with time zone,
	"estimate_doc_id" uuid,
	"estimate_expires_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone,
	"scheduled_window_minutes" integer,
	"deposit_amount" numeric(10, 2),
	"deposit_paid_at" timestamp with time zone,
	"performed_by" text,
	"assigned_subcontractor_id" uuid,
	"subcontractor_pay_amount" numeric(10, 2),
	"completed_at" timestamp with time zone,
	"invoice_amount" numeric(10, 2),
	"invoice_paid_at" timestamp with time zone,
	"invoice_doc_id" uuid,
	"payment_method" text,
	"payment_reference" text,
	"customer_rating" integer,
	"customer_review_text" text,
	"has_dispute" integer DEFAULT 0 NOT NULL,
	"homedoctor_recommendation_id" uuid,
	"homedoctor_check_id" uuid,
	"next_followup_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" uuid,
	"owner_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"event_type" "job_event_type" NOT NULL,
	"event_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" uuid,
	"actor_role" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pipeline_stage_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"from_stage" "pipeline_stage",
	"to_stage" "pipeline_stage" NOT NULL,
	"transitioned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"transitioned_by_user_id" uuid,
	"reason" text,
	"notes" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_uploaded_by_user_id_user_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role_grant" ADD CONSTRAINT "user_role_grant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role_grant" ADD CONSTRAINT "user_role_grant_granted_by_user_id_user_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "household" ADD CONSTRAINT "household_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "household" ADD CONSTRAINT "household_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property" ADD CONSTRAINT "property_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property" ADD CONSTRAINT "property_primary_contact_user_id_user_id_fk" FOREIGN KEY ("primary_contact_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_payout" ADD CONSTRAINT "subcontractor_payout_subcontractor_id_subcontractor_roster_id_fk" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractor_roster"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_payout_job" ADD CONSTRAINT "subcontractor_payout_job_payout_id_subcontractor_payout_id_fk" FOREIGN KEY ("payout_id") REFERENCES "public"."subcontractor_payout"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_rate_sheet" ADD CONSTRAINT "subcontractor_rate_sheet_subcontractor_id_subcontractor_roster_id_fk" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractor_roster"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_rate_sheet" ADD CONSTRAINT "subcontractor_rate_sheet_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_roster" ADD CONSTRAINT "subcontractor_roster_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcontractor_roster" ADD CONSTRAINT "subcontractor_roster_added_by_user_id_user_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_assigned_subcontractor_id_subcontractor_roster_id_fk" FOREIGN KEY ("assigned_subcontractor_id") REFERENCES "public"."subcontractor_roster"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_event" ADD CONSTRAINT "job_event_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_event" ADD CONSTRAINT "job_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pipeline_stage_history" ADD CONSTRAINT "pipeline_stage_history_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pipeline_stage_history" ADD CONSTRAINT "pipeline_stage_history_transitioned_by_user_id_user_id_fk" FOREIGN KEY ("transitioned_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
