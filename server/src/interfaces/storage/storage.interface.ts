import { estimates, schedules, type Estimate, type InsertEstimate, type Schedule, type InsertSchedule, type User, type InsertUser } from "server/schema/schema";

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