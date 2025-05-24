import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const estimates = pgTable("estimates", {
  id: serial("id").primaryKey(),
  projectType: text("project_type").notNull(),
  area: integer("area").notNull(),
  materialQuality: text("material_quality").notNull(),
  timeline: text("timeline"),
  description: text("description"),
  estimatedCost: real("estimated_cost").notNull(),
  
  // Material details (JSON string)
  materials: text("materials"),
  
  // Labor details
  laborWorkers: integer("labor_workers"),
  laborHours: integer("labor_hours"),
  laborRate: real("labor_rate"),
  tradeType: text("trade_type"),
  
  // Project factors
  demolitionRequired: boolean("demolition_required").default(false),
  permitNeeded: boolean("permit_needed").default(false),
  siteAccess: text("site_access"),
  timelineSensitivity: text("timeline_sensitivity"),
  
  // Cost breakdown
  laborCost: real("labor_cost"),
  materialCost: real("material_cost"),
  permitCost: real("permit_cost"),
  softCosts: real("soft_costs"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  inspectionType: text("inspection_type").notNull(),
  priority: text("priority").notNull().default("standard"),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  notes: text("notes"),
  notifications: text("notifications").array(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEstimateSchema = createInsertSchema(estimates).omit({
  id: true,
  createdAt: true,
  estimatedCost: true,
  laborCost: true,
  materialCost: true,
  permitCost: true,
  softCosts: true,
}).extend({
  timeline: z.string().min(1, "Timeline is required"),
  description: z.string().min(1, "Description is required"),
  materials: z.string().optional(),
  laborWorkers: z.number().min(1, "At least 1 worker required").optional(),
  laborHours: z.number().min(1, "Labor hours required").optional(),
  laborRate: z.number().min(1, "Labor rate required").optional(),
  tradeType: z.string().optional(),
  demolitionRequired: z.boolean().optional(),
  permitNeeded: z.boolean().optional(),
  siteAccess: z.string().optional(),
  timelineSensitivity: z.string().optional(),
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertEstimate = z.infer<typeof insertEstimateSchema>;
export type Estimate = typeof estimates.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;

// Lead tracking for new business opportunities
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  zipCode: text("zip_code").notNull(),
  projectType: text("project_type").notNull(),
  status: text("status").notNull().default("new"), // new, follow-up, in-review, cold
  source: text("source").notNull().default("estimate-form"), // estimate-form, referral, etc
  notes: text("notes"),
  estimatedValue: real("estimated_value"),
  followUpDate: text("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Internal ideas tracker
export const internalIdeas = pgTable("internal_ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // follow-up, referral, marketing, etc
  status: text("status").notNull().default("idea"), // idea, researching, pursuing, completed, cancelled
  priority: text("priority").notNull().default("medium"), // low, medium, high
  assignedTo: text("assigned_to"),
  targetDate: text("target_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Lead schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertInternalIdeaSchema = createInsertSchema(internalIdeas).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertInternalIdea = z.infer<typeof insertInternalIdeaSchema>;
export type InternalIdea = typeof internalIdeas.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
