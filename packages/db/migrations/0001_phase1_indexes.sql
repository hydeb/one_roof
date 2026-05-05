-- Phase 1 performance indexes per docs/spec/ONE_ROOF_HOMES_Drizzle_Schema_Phase1.md §Indexes.
-- Hand-written because drizzle-kit doesn't infer partial indexes from schema.

-- Pipeline view (operator's home page, hot path)
CREATE INDEX IF NOT EXISTS idx_job_pipeline_stage_owner
  ON "job" (owner_user_id, pipeline_stage)
  WHERE pipeline_stage NOT IN ('completed_won', 'lost');
--> statement-breakpoint

-- Followup queue
CREATE INDEX IF NOT EXISTS idx_job_next_followup
  ON "job" (next_followup_at)
  WHERE pipeline_stage NOT IN ('completed_won', 'lost') AND next_followup_at IS NOT NULL;
--> statement-breakpoint

-- Customer history lookup
CREATE INDEX IF NOT EXISTS idx_job_customer_completed
  ON "job" (customer_id, completed_at DESC)
  WHERE pipeline_stage = 'completed_won';
--> statement-breakpoint

-- Subcontractor work history
CREATE INDEX IF NOT EXISTS idx_job_subcontractor_completed
  ON "job" (assigned_subcontractor_id, completed_at DESC)
  WHERE pipeline_stage = 'completed_won';
--> statement-breakpoint

-- Job event timeline lookup
CREATE INDEX IF NOT EXISTS idx_job_event_job_occurred
  ON job_event (job_id, occurred_at DESC);
--> statement-breakpoint

-- Pipeline analytics
CREATE INDEX IF NOT EXISTS idx_pipeline_stage_history_job
  ON pipeline_stage_history (job_id, transitioned_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_pipeline_stage_history_to_stage_at
  ON pipeline_stage_history (to_stage, transitioned_at);
--> statement-breakpoint

-- Geographic property lookup (for job-routing in Phase 2+)
CREATE INDEX IF NOT EXISTS idx_property_postal_code
  ON property (postal_code);
--> statement-breakpoint

-- Cross-product event processing
CREATE INDEX IF NOT EXISTS idx_event_outbox_unprocessed
  ON event_outbox (created_at)
  WHERE processed_at IS NULL;
--> statement-breakpoint

-- Audit queries
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_occurred
  ON audit_log (actor_user_id, occurred_at DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_audit_log_target
  ON audit_log (target_type, target_id, occurred_at DESC);
