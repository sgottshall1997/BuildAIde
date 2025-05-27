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

    const prompt = `You are an AI assistant for Spence the Builder, a professional construction business. Based on current project data, what should the project manager prioritize today?

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
        content: `You are a senior construction risk analyst with 20+ years managing projects worth $2B+. Your risk assessments have prevented millions in overruns.

        Analyze projects like an insurance underwriter - identify specific risks, quantify impacts, and provide actionable mitigation strategies. Consider:
        - **Seasonal factors** (weather, material availability)
        - **Regional risks** (permits, labor costs, regulations)  
        - **Project-specific risks** (complexity, timeline pressure)
        - **Market conditions** (material price volatility, labor shortages)
        - **Hidden costs** that novices miss

        Include at least one unexpected risk factor that experienced contractors would flag.
        
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
          "timelineBuffer": number (percentage),
          "expertInsight": "string"
        }`
      },
      {
        role: "user",
        content: `**PROJECT RISK ANALYSIS REQUEST**

**Project Scope:**
- Type: ${projectData.projectType} renovation
- Size: ${projectData.area} sq ft
- Quality Tier: ${projectData.materialQuality}
- Timeline: ${projectData.timeline}
- Budget: $${projectData.estimatedCost?.toLocaleString()}
- Location: ${projectData.zipCode || 'Maryland region'}

**Assessment Requirements:**
1. **Weather/Seasonal Risks** - Current season impacts on timeline/costs
2. **Regional Factors** - Local permit complexity, labor availability, material costs
3. **Project Complexity** - Technical challenges specific to this scope
4. **Market Volatility** - Material price trends, supply chain risks
5. **Hidden Cost Traps** - Commonly overlooked expenses for this project type

**Deliverables:**
- Risk score with detailed breakdown
- Specific mitigation strategies with cost estimates
- Recommended contingency percentages
- One "expert insight" that separates pros from amateurs

Base your analysis on real construction industry data and regional market conditions.`
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
      riskScore: 55,
      factors: [
        {
          category: "Regional Permit Risk",
          risk: "medium",
          description: "Maryland permit approval times vary 2-4 weeks depending on jurisdiction complexity",
          mitigation: "Submit permits early, maintain contact with permit office, consider expedited processing",
          impact: "Potential 2-3 week timeline delay, $500-1500 in expedite fees"
        }
      ],
      recommendations: ["Maintain 18% budget contingency for current market conditions", "Schedule weather-sensitive work for optimal seasons"],
      budgetBuffer: 18,
      timelineBuffer: 25,
      expertInsight: "Most homeowners underestimate utility relocation costs - budget extra for unexpected electrical/plumbing moves"
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
          content: `You are a master construction consultant with 25+ years of field experience and $500M+ in completed projects. Your expertise spans residential, commercial, and high-end custom builds.

          Provide 3 specific, actionable insights that demonstrate deep industry knowledge. Include:
          - At least one unexpected cost-saving strategy
          - One expert-level insight about materials/labor/timeline
          - Regional considerations based on location
          
          Format with markdown bullets and be specific with numbers/costs when possible.
          Respond with JSON: {"suggestions": ["• **Cost Strategy:** specific tip with numbers", "• **Expert Insight:** technical detail", "• **Regional Factor:** location-specific advice"]}`
        },
        {
          role: "user",
          content: `Analyze this project with expert precision:

**Project Details:**
- Type: ${formData.projectType || 'General renovation'} (${formData.area || 0} sq ft)
- Quality Level: ${formData.materialQuality || 'Standard'}
- Workforce: ${formData.laborWorkers || 'TBD'} workers, ${formData.laborHours || 'TBD'} hours
- Timeline: ${formData.timeline || 'Standard'}
- Location: ${formData.zipCode || 'Maryland'}
- Site Access: ${formData.siteAccess || 'Standard'}

**Focus Areas:**
1. Identify potential 10-20% cost savings without quality compromise
2. Spot timeline risks or optimization opportunities  
3. Flag regional pricing trends or permit considerations
4. Suggest premium upgrades with strong ROI potential

Provide insider knowledge that only experienced contractors would know.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"suggestions":[]}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating smart suggestions:', error);
    return [
      "• **Cost Strategy:** Bundle electrical and plumbing rough-in to save 15-20% on labor coordination costs",
      "• **Expert Insight:** Mid-grade materials often offer 80% of premium performance at 60% of the cost",
      "• **Regional Factor:** Maryland permits typically take 2-3 weeks - submit early to avoid project delays"
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
          role: "system",
          content: `You are a senior construction estimator with expertise in cost analysis and project optimization. Explain project modifications like you're briefing a client or project stakeholder.

          Provide a clear, professional explanation that:
          - Identifies the key cost drivers
          - Explains the percentage impact and why
          - Includes one practical insight about the change
          - Uses confident, consultative language

          Keep response to 2-3 sentences maximum.`
        },
        {
          role: "user",
          content: `**SCENARIO ANALYSIS**

**Modified Project Parameters:**
- Material Quality: ${modifiedEstimate.materialQuality || 'Standard'}
- Labor Force: ${modifiedEstimate.laborWorkers || 'Standard'} workers
- Timeline: ${modifiedEstimate.timeline || 'Standard'}
- Project Area: ${modifiedEstimate.area || 0} sq ft

**Financial Impact:**
- New Total: $${estimatedCost.toLocaleString()}
- Material Costs: $${materialCost.toLocaleString()}
- Labor Costs: $${laborCost.toLocaleString()}

**Analysis Request:**
Explain what drove this cost change and provide one expert insight about the modification's impact on project success or value.`
        }
      ],
      max_tokens: 150,
      temperature: 0.3
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
      explanation: "Cost adjusted based on project modifications - contact your project manager for detailed breakdown."
    };
  }
}