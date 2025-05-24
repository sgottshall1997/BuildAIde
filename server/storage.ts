import { estimates, schedules, type Estimate, type InsertEstimate, type Schedule, type InsertSchedule, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods (keeping for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Estimate methods
  createEstimate(estimate: InsertEstimate): Promise<Estimate>;
  getEstimates(): Promise<Estimate[]>;
  getEstimate(id: number): Promise<Estimate | undefined>;
  
  // Schedule methods
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private estimates: Map<number, Estimate>;
  private schedules: Map<number, Schedule>;
  private currentUserId: number;
  private currentEstimateId: number;
  private currentScheduleId: number;

  constructor() {
    this.users = new Map();
    this.estimates = new Map();
    this.schedules = new Map();
    this.currentUserId = 1;
    this.currentEstimateId = 1;
    this.currentScheduleId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEstimate(insertEstimate: InsertEstimate): Promise<Estimate> {
    const id = this.currentEstimateId++;
    
    const estimate: Estimate = {
      ...insertEstimate,
      id,
      timeline: insertEstimate.timeline || null,
      description: insertEstimate.description || null,
      materials: insertEstimate.materials || null,
      laborWorkers: insertEstimate.laborWorkers || null,
      laborHours: insertEstimate.laborHours || null,
      laborRate: insertEstimate.laborRate || null,
      tradeType: insertEstimate.tradeType || null,
      siteAccess: insertEstimate.siteAccess || null,
      timelineSensitivity: insertEstimate.timelineSensitivity || null,
      laborCost: insertEstimate.laborCost || 0,
      materialCost: insertEstimate.materialCost || 0,
      permitCost: insertEstimate.permitCost || 0,
      softCosts: insertEstimate.softCosts || 0,
      estimatedCost: insertEstimate.estimatedCost || 0,
      createdAt: new Date(),
    };
    
    this.estimates.set(id, estimate);
    return estimate;
  }

  async getEstimates(): Promise<Estimate[]> {
    return Array.from(this.estimates.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getEstimate(id: number): Promise<Estimate | undefined> {
    return this.estimates.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = this.currentScheduleId++;
    const schedule: Schedule = {
      id,
      contactName: insertSchedule.contactName,
      email: insertSchedule.email,
      phone: insertSchedule.phone,
      company: insertSchedule.company || null,
      address: insertSchedule.address,
      city: insertSchedule.city,
      zipCode: insertSchedule.zipCode,
      inspectionType: insertSchedule.inspectionType,
      priority: insertSchedule.priority,
      preferredDate: insertSchedule.preferredDate,
      preferredTime: insertSchedule.preferredTime,
      notes: insertSchedule.notes || null,
      notifications: insertSchedule.notifications || null,
      status: "scheduled",
      createdAt: new Date(),
    };
    
    this.schedules.set(id, schedule);
    return schedule;
  }

  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }
}

export const storage = new MemStorage();
