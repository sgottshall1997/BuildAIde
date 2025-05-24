import OpenAI from "openai";
import type { Estimate, Schedule } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function explainEstimate(estimate: Estimate): Promise<string> {
  try {
    const prompt = `You are an experienced construction project manager. Explain this project estimate in simple, professional language that a client would understand. Focus on the key factors that determined the cost and what's included.

Estimate Details:
- Project Type: ${estimate.projectType}
- Area: ${estimate.area} sq ft
- Material Quality: ${estimate.materialQuality}
- Timeline: ${estimate.timeline || 'Standard'}
- Description: ${estimate.description || 'No additional details'}
- Total Cost: $${estimate.estimatedCost.toLocaleString()}

Provide a clear, professional explanation in 2-3 sentences that helps the client understand the estimate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    return response.choices[0].message.content || "Unable to generate explanation.";
  } catch (error) {
    console.error("Error explaining estimate:", error);
    throw new Error("Failed to generate estimate explanation");
  }
}

export async function summarizeSchedule(schedules: Schedule[]): Promise<string> {
  try {
    if (schedules.length === 0) {
      return "No upcoming inspections or permits scheduled. Consider reviewing your project timeline.";
    }

    const scheduleData = schedules.map(s => ({
      type: s.inspectionType,
      date: s.preferredDate,
      time: s.preferredTime,
      address: s.address,
      priority: s.priority,
      status: s.status
    }));

    const prompt = `You are a construction project manager. Analyze this permit and inspection schedule and provide a concise summary of upcoming tasks, priorities, and any potential issues.

Schedule Data:
${JSON.stringify(scheduleData, null, 2)}

Provide a professional summary in 2-3 sentences focusing on:
- What's coming up soon
- Any scheduling conflicts or priorities
- Actionable recommendations for the PM`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    return response.choices[0].message.content || "Unable to generate schedule summary.";
  } catch (error) {
    console.error("Error summarizing schedule:", error);
    throw new Error("Failed to generate schedule summary");
  }
}

export async function getAIRecommendations(estimates: Estimate[], schedules: Schedule[]): Promise<string> {
  try {
    const estimateCount = estimates.length;
    const upcomingInspections = schedules.filter(s => {
      const inspectionDate = new Date(s.preferredDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return inspectionDate >= today && inspectionDate <= nextWeek;
    });
    
    const urgentInspections = schedules.filter(s => s.priority === 'urgent' || s.priority === 'emergency');

    const prompt = `You are an AI assistant for Shall's Construction, a family-owned residential construction business in Maryland. Based on current project data, what should the project manager prioritize today?

Current Situation:
- Total estimates this period: ${estimateCount}
- Upcoming inspections (next 7 days): ${upcomingInspections.length}
- Urgent/emergency inspections: ${urgentInspections.length}
- Recent inspection types: ${schedules.slice(0, 3).map(s => s.inspectionType).join(', ') || 'None'}

Provide 2-3 specific, actionable recommendations for what the PM should focus on today. Be concise and practical for a busy construction team.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.4
    });

    return response.choices[0].message.content || "Focus on completing pending estimates and confirming upcoming inspection schedules.";
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw new Error("Failed to generate AI recommendations");
  }
}

export async function draftEmail(type: 'estimate' | 'permit', data: any): Promise<string> {
  try {
    let prompt = "";
    
    if (type === 'estimate') {
      prompt = `Draft a professional email to send to a client with their construction project estimate. 

Estimate Details:
- Project Type: ${data.projectType}
- Area: ${data.area} sq ft
- Total Cost: $${data.estimatedCost.toLocaleString()}
- Timeline: ${data.timeline || 'Standard'}

Write a professional, friendly email from Shall's Construction that:
- Thanks them for their interest
- Presents the estimate clearly
- Mentions next steps
- Keeps it concise and professional

Do not include placeholders like [Client Name] - write it as a template they can customize.`;
    } else {
      prompt = `Draft a professional email update about a permit/inspection for a construction client.

Inspection Details:
- Type: ${data.inspectionType}
- Date: ${data.preferredDate}
- Time: ${data.preferredTime}
- Address: ${data.address}

Write a professional email from Shall's Construction that:
- Confirms the scheduled inspection
- Provides clear details
- Mentions what to expect
- Includes contact information for questions

Keep it concise and professional.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.3
    });

    return response.choices[0].message.content || "Unable to generate email draft.";
  } catch (error) {
    console.error("Error drafting email:", error);
    throw new Error("Failed to generate email draft");
  }
}