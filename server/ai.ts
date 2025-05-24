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

Write a professional, friendly email from Spence the Builder that:
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

Write a professional email from Spence the Builder that:
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

export async function generateRiskAssessment(projectData: {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  estimatedCost: number;
  zipCode?: string;
}): Promise<any> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert construction risk analyst. Analyze construction projects for potential risks and provide detailed assessments. 
        Respond with JSON in this exact format:
        {
          "overallRisk": "low|medium|high",
          "riskScore": number (0-100),
          "factors": [
            {
              "category": "string",
              "risk": "low|medium|high", 
              "description": "string",
              "mitigation": "string",
              "impact": "string"
            }
          ],
          "recommendations": ["string"],
          "budgetBuffer": number (percentage),
          "timelineBuffer": number (percentage)
        }`
      },
      {
        role: "user",
        content: `Analyze this construction project for risks:
        Project Type: ${projectData.projectType}
        Area: ${projectData.area} sq ft
        Material Quality: ${projectData.materialQuality}
        Timeline: ${projectData.timeline}
        Estimated Cost: $${projectData.estimatedCost}
        Location: ${projectData.zipCode || 'Maryland'}
        
        Consider factors like weather, permits, material availability, labor, site conditions, and market conditions.`
      }
    ],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error parsing risk assessment:', error);
    return {
      overallRisk: "medium",
      riskScore: 50,
      factors: [
        {
          category: "General Project Risk",
          risk: "medium",
          description: "Standard construction project with typical risk factors",
          mitigation: "Follow standard construction practices and maintain contingency funds",
          impact: "Potential for moderate cost and schedule variations"
        }
      ],
      recommendations: ["Maintain 15% budget contingency", "Plan for weather-related delays"],
      budgetBuffer: 15,
      timelineBuffer: 20
    };
  }
}

export async function generateSmartSuggestions(formData: any): Promise<string[]> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert construction estimator. Provide 2-3 specific, actionable suggestions based on the project details provided. 
          Focus on practical advice about materials, labor, timeline, or cost optimization. Keep suggestions concise and professional.
          Respond with JSON in this format: {"suggestions": ["suggestion1", "suggestion2", "suggestion3"]}`
        },
        {
          role: "user",
          content: `Provide smart suggestions for this construction project:
          Project: ${formData.projectType || 'Not specified'} (${formData.area || 0} sq ft)
          Materials: ${formData.materialQuality || 'Not specified'}
          Labor: ${formData.laborWorkers || 'Not specified'} workers, ${formData.laborHours || 'Not specified'} hours
          Timeline: ${formData.timeline || 'Not specified'}
          Site Access: ${formData.siteAccess || 'Not specified'}
          
          Give specific advice about potential cost savings, efficiency improvements, or common pitfalls to avoid.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"suggestions":[]}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating smart suggestions:', error);
    return [
      "Consider getting multiple material quotes to ensure competitive pricing.",
      "Weather conditions in Maryland can affect outdoor work - plan for potential delays.",
      "Verify all permit requirements early to avoid timeline delays."
    ];
  }
}

export async function calculateScenario(modifiedEstimate: any): Promise<any> {
  // Calculate new estimate based on modifications
  let materialCost = modifiedEstimate.materialCost || 0;
  let laborCost = modifiedEstimate.laborCost || 0;
  let permitCost = modifiedEstimate.permitCost || 0;
  let softCosts = modifiedEstimate.softCosts || 0;

  // Adjust for material quality changes
  if (modifiedEstimate.materialQuality) {
    const qualityMultipliers = { budget: 0.7, standard: 1.0, premium: 1.4, luxury: 1.8 };
    const multiplier = qualityMultipliers[modifiedEstimate.materialQuality as keyof typeof qualityMultipliers] || 1.0;
    materialCost = (modifiedEstimate.area || 0) * 50 * multiplier; // Base material cost
  }

  // Adjust for labor changes
  if (modifiedEstimate.laborWorkers && modifiedEstimate.laborHours && modifiedEstimate.laborRate) {
    laborCost = modifiedEstimate.laborWorkers * modifiedEstimate.laborHours * modifiedEstimate.laborRate;
  }

  // Timeline adjustments
  let timelineMultiplier = 1.0;
  if (modifiedEstimate.timeline === 'expedited') timelineMultiplier = 1.3;
  if (modifiedEstimate.timeline === 'extended') timelineMultiplier = 0.9;

  const baseCost = materialCost + laborCost + permitCost;
  softCosts = baseCost * 0.15; // 15% overhead
  const estimatedCost = Math.round((baseCost + softCosts) * timelineMultiplier);

  // Generate AI explanation
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Explain the cost impact of this project modification in 1-2 sentences:
          Material Quality: ${modifiedEstimate.materialQuality}
          Workers: ${modifiedEstimate.laborWorkers}
          Timeline: ${modifiedEstimate.timeline}
          New Total: $${estimatedCost.toLocaleString()}
          
          Focus on what changed and why it affects the cost.`
        }
      ],
      max_tokens: 100,
    });

    const explanation = completion.choices[0].message.content || "Cost adjusted based on project modifications.";

    return {
      estimatedCost,
      materialCost,
      laborCost,
      permitCost,
      softCosts,
      explanation
    };
  } catch (error) {
    console.error('Error generating scenario explanation:', error);
    return {
      estimatedCost,
      materialCost,
      laborCost,
      permitCost,
      softCosts,
      explanation: "Cost adjusted based on project modifications."
    };
  }
}