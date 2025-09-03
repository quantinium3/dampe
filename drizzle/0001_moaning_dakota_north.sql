ALTER TABLE "files" ADD COLUMN "ai_metadata" jsonb DEFAULT 'null'::jsonb;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "ai_analyzed" boolean DEFAULT false;