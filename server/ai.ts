import OpenAI from "openai";
import type { Estimate, Schedule } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Safe JSON parsing helper function
function safeJSONParse(jsonString: string, fallback: any = {}) {
  try {
    return JSON.parse(jsonString || '{}');
  } catch (error) {
    console.error('JSON parse failed:', error);
    return { ...fallback, error: 'Invalid response format', fallback: true };
  }
}

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

export async function generateLeadStrategies(leadData: {
  location: string;
  serviceType: string;
  budget: string;
  timeframe: string;
  targetAudience: string;
}): Promise<{
  strategies: string[];
  channels: string[];
  sampleMessages: string[];
  nextSteps: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a marketing strategist specializing in lead generation for construction contractors. Act as a professional consultant. Always produce valid JSON without explanations. Provide concrete, actionable strategies for finding new project leads."
        },
        {
          role: "user",
          content: `Given the following details – Location: ${leadData.location}, Service: ${leadData.serviceType}, Budget: $${leadData.budget}, Timeframe: ${leadData.timeframe}, TargetAudience: ${leadData.targetAudience} – generate a prioritized list of lead-generation strategies. Include recommended channels (e.g. online ads, trade shows, referrals), sample outreach messages, and next steps. Focus on the construction industry context and format your answer as JSON with this structure:

{
  "strategies": ["strategy1", "strategy2", "strategy3"],
  "channels": ["channel1", "channel2", "channel3"],
  "sampleMessages": ["message1", "message2"],
  "nextSteps": ["step1", "step2", "step3"]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      strategies: result.strategies || [],
      channels: result.channels || [],
      sampleMessages: result.sampleMessages || [],
      nextSteps: result.nextSteps || []
    };
  } catch (error) {
    console.error('Error generating lead strategies:', error);
    throw new Error('Failed to generate lead strategies');
  }
}

export async function analyzeMaterialCosts(materialData: {
  items: Array<{ name: string; quantity: number; unitCost: number }>;
  budget?: number;
}): Promise<{
  totalSpent: number;
  budget?: number;
  remainingBudget?: number;
  items: Array<{ name: string; quantity: number; unitCost: number; subtotal: number }>;
  breakdownByCategory: Record<string, number>;
  budgetWarnings: string[];
  costSavingTips: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction budgeting assistant with expertise in material cost analysis. Return structured summaries of material costs in JSON format. Categorize materials logically and provide actionable cost-saving insights."
        },
        {
          role: "user",
          content: `Analyze the following material purchases and provide a comprehensive cost breakdown:

Items: ${JSON.stringify(materialData.items)}
${materialData.budget ? `Budget: $${materialData.budget}` : ''}

Calculate:
1. Total spent across all items
2. Remaining budget (if budget provided)
3. Category breakdown (e.g., framing, finishes, electrical, plumbing)
4. Budget warnings if approaching or over budget
5. Cost-saving tips based on the materials

Return JSON with this structure:
{
  "totalSpent": number,
  "budget": number,
  "remainingBudget": number,
  "items": [{"name": string, "quantity": number, "unitCost": number, "subtotal": number}],
  "breakdownByCategory": {"categoryName": number},
  "budgetWarnings": ["warning1", "warning2"],
  "costSavingTips": ["tip1", "tip2"]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      totalSpent: result.totalSpent || 0,
      budget: result.budget,
      remainingBudget: result.remainingBudget,
      items: result.items || [],
      breakdownByCategory: result.breakdownByCategory || {},
      budgetWarnings: result.budgetWarnings || [],
      costSavingTips: result.costSavingTips || []
    };
  } catch (error) {
    console.error('Error analyzing material costs:', error);
    throw new Error('Failed to analyze material costs');
  }
}

export async function compareSubcontractors(subcontractorData: {
  subA: { name: string; bid: number; experience: number; rating: number };
  subB: { name: string; bid: number; experience: number; rating: number };
  subC?: { name: string; bid: number; experience: number; rating: number };
  projectRequirements: string;
}): Promise<{
  comparisons: Array<{ name: string; cost: number; experience: number; score: number }>;
  bestChoice: string;
  reasoning: string;
  detailedAnalysis: string[];
  riskFactors: string[];
}> {
  try {
    const { subA, subB, subC, projectRequirements } = subcontractorData;
    
    const subCText = subC ? `, C(${subC.name}, bid=${subC.bid}, exp=${subC.experience}, rating=${subC.rating})` : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction procurement analyst with expertise in subcontractor evaluation. Analyze subcontractor bids considering cost, experience, ratings, and project requirements. Output structured JSON with detailed analysis and recommendations."
        },
        {
          role: "user",
          content: `Analyze these subcontractor bids:
          
Subs: A(${subA.name}, bid=${subA.bid}, exp=${subA.experience}, rating=${subA.rating}), B(${subB.name}, bid=${subB.bid}, exp=${subB.experience}, rating=${subB.rating})${subCText}. 
Requirements: ${projectRequirements}.

Provide comprehensive analysis including:
1. Comparative scoring (0-100) weighing cost, experience, and ratings
2. Best choice recommendation with detailed reasoning
3. Risk factors for each subcontractor
4. Project-specific considerations

Return JSON with this structure:
{
  "comparisons": [{"name": string, "cost": number, "experience": number, "score": number}],
  "bestChoice": string,
  "reasoning": string,
  "detailedAnalysis": ["analysis1", "analysis2"],
  "riskFactors": ["risk1", "risk2"]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      comparisons: result.comparisons || [],
      bestChoice: result.bestChoice || '',
      reasoning: result.reasoning || '',
      detailedAnalysis: result.detailedAnalysis || [],
      riskFactors: result.riskFactors || []
    };
  } catch (error) {
    console.error('Error comparing subcontractors:', error);
    throw new Error('Failed to compare subcontractors');
  }
}

export async function assessProjectRisks(projectData: {
  projectType: string;
  scopeDetails: string;
  location: string;
  budget: number;
  timeline: string;
}): Promise<{
  risks: Array<{
    category: string;
    level: 'Low' | 'Medium' | 'High';
    description: string;
    impact: string;
    probability: string;
  }>;
  mitigations: string[];
  overallRiskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  contingencyBudget: number;
}> {
  try {
    const { projectType, scopeDetails, location, budget, timeline } = projectData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction risk management consultant with expertise in identifying and mitigating project risks. Analyze construction projects and provide structured risk assessments with actionable mitigation strategies. Output detailed JSON analysis."
        },
        {
          role: "user",
          content: `Assess the risks for this construction project:

Project: ${projectType}
Scope: ${scopeDetails}
Location: ${location}
Budget: $${budget.toLocaleString()}
Timeline: ${timeline}

Provide comprehensive risk analysis including:
1. Key risks categorized by type (Financial, Permitting, Schedule, Weather, Labor, Materials, etc.)
2. Risk levels (Low/Medium/High) with impact and probability assessments
3. Specific mitigation strategies for each risk
4. Overall project risk level
5. Recommended contingency budget percentage
6. Actionable recommendations

Return JSON with this structure:
{
  "risks": [{"category": string, "level": "Low|Medium|High", "description": string, "impact": string, "probability": string}],
  "mitigations": ["mitigation1", "mitigation2"],
  "overallRiskLevel": "Low|Medium|High",
  "recommendations": ["recommendation1", "recommendation2"],
  "contingencyBudget": number
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and normalize risk levels
    const normalizeRiskLevel = (level: string): 'Low' | 'Medium' | 'High' => {
      const normalized = level?.toLowerCase();
      if (normalized === 'low') return 'Low';
      if (normalized === 'high') return 'High';
      return 'Medium'; // Default to Medium if unclear
    };
    
    return {
      risks: (result.risks || []).map((risk: any) => ({
        ...risk,
        level: normalizeRiskLevel(risk.level)
      })),
      mitigations: result.mitigations || [],
      overallRiskLevel: normalizeRiskLevel(result.overallRiskLevel),
      recommendations: result.recommendations || [],
      contingencyBudget: result.contingencyBudget || Math.round(budget * 0.15) // Default 15% contingency
    };
  } catch (error) {
    console.error('Error assessing project risks:', error);
    throw new Error('Failed to assess project risks');
  }
}

export async function generateProjectTimeline(timelineData: {
  projectType: string;
  size: string;
  startDate: string;
  majorTasks: string[];
}): Promise<{
  timeline: Array<{
    task: string;
    durationWeeks: number;
    startWeek: number;
    endWeek: number;
    category: string;
    dependencies: string[];
    criticalPath: boolean;
  }>;
  totalDuration: number;
  projectEndDate: string;
  criticalPathTasks: string[];
  recommendations: string[];
}> {
  try {
    const { projectType, size, startDate, majorTasks } = timelineData;
    
    // Fallback tasks if none provided
    const defaultTasks = projectType.toLowerCase().includes('kitchen') 
      ? ["Demolition", "Rough Plumbing", "Rough Electrical", "Framing", "Insulation", "Drywall", "Painting", "Flooring", "Cabinet Installation", "Finish Plumbing", "Final Inspection"]
      : ["Planning & Permits", "Demolition", "Structural Work", "Rough-in (Plumbing/Electrical)", "Insulation", "Drywall", "Flooring", "Painting", "Finish Work", "Final Inspection"];
    
    const tasksToUse = majorTasks.length > 0 ? majorTasks : defaultTasks;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction timeline expert with deep knowledge of task sequencing, dependencies, and realistic duration estimates. Create detailed project schedules with proper task ordering and critical path analysis. Output structured JSON timelines."
        },
        {
          role: "user",
          content: `Create a realistic construction timeline for this project:

Project: ${projectType}
Size: ${size}
Start Date: ${startDate}
Major Tasks: ${tasksToUse.join(', ')}

Provide comprehensive timeline analysis including:
1. Task durations (support hours, days, weeks - adapt to project scale)
2. Sequential task ordering with proper dependencies
3. Start and end periods for each task
4. Task categories (structural, mechanical, finishing, etc.)
5. Critical path identification
6. Total project duration
7. Project completion date
8. Timeline optimization recommendations

For small projects (under 1 week), use hours. For medium projects, use days or weeks. For large projects, use weeks or months.

Return JSON with this structure:
{
  "timeline": [{"task": string, "duration": number, "durationUnit": string, "startPeriod": number, "endPeriod": number, "category": string, "dependencies": [string], "criticalPath": boolean}],
  "totalDuration": number,
  "totalDurationUnit": string,
  "projectEndDate": string,
  "criticalPathTasks": [string],
  "recommendations": [string]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate timeline data
    const timeline = (result.timeline || []).map((task: any, index: number) => ({
      task: task.task || `Task ${index + 1}`,
      durationWeeks: Math.max(1, Math.round(task.durationWeeks || 1)),
      startWeek: Math.max(1, Math.round(task.startWeek || index + 1)),
      endWeek: Math.max(1, Math.round(task.endWeek || index + 2)),
      category: task.category || 'General',
      dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
      criticalPath: Boolean(task.criticalPath)
    }));
    
    return {
      timeline,
      totalDuration: result.totalDuration || timeline.length,
      projectEndDate: result.projectEndDate || 'TBD',
      criticalPathTasks: Array.isArray(result.criticalPathTasks) ? result.criticalPathTasks : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
  } catch (error) {
    console.error('Error generating project timeline:', error);
    throw new Error('Failed to generate project timeline');
  }
}

export async function generateBudgetPlan(budgetData: {
  monthlyIncome: number;
  monthlyExpenses: number;
  renovationGoal: number;
  timeframe: number;
}): Promise<{
  monthlySavings: number;
  monthsToSave: number;
  budgetAllocation: {
    LivingExpenses: number;
    RenovationSavings: number;
    EmergencyFund: number;
    DiscretionarySpending: number;
  };
  actionSteps: string[];
  feasibilityAnalysis: string;
  recommendations: string[];
  savingsRate: number;
}> {
  try {
    const { monthlyIncome, monthlyExpenses, renovationGoal, timeframe } = budgetData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a personal budgeting expert specializing in renovation financing and financial planning. Create realistic budget plans that balance living expenses, savings goals, and financial security. Output detailed JSON analysis with actionable recommendations."
        },
        {
          role: "user",
          content: `Create a comprehensive budget plan for this renovation project:

Monthly Income: $${monthlyIncome.toLocaleString()}
Current Monthly Expenses: $${monthlyExpenses.toLocaleString()}
Renovation Goal: $${renovationGoal.toLocaleString()}
Target Timeframe: ${timeframe} months

Provide detailed budget analysis including:
1. Required monthly savings amount to reach goal
2. Realistic budget allocation across categories
3. Feasibility analysis of the savings goal
4. Specific actionable steps to achieve the target
5. Financial recommendations and optimization tips
6. Emergency fund considerations
7. Alternative timeframe suggestions if needed

Return JSON with this structure:
{
  "monthlySavings": number,
  "monthsToSave": number,
  "budgetAllocation": {
    "LivingExpenses": number,
    "RenovationSavings": number,
    "EmergencyFund": number,
    "DiscretionarySpending": number
  },
  "actionSteps": [string],
  "feasibilityAnalysis": string,
  "recommendations": [string],
  "savingsRate": number
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Calculate fallback values if needed
    const availableForSavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const requiredMonthlySavings = renovationGoal / timeframe;
    
    return {
      monthlySavings: result.monthlySavings || Math.min(requiredMonthlySavings, availableForSavings),
      monthsToSave: result.monthsToSave || timeframe,
      budgetAllocation: {
        LivingExpenses: result.budgetAllocation?.LivingExpenses || monthlyExpenses,
        RenovationSavings: result.budgetAllocation?.RenovationSavings || Math.min(requiredMonthlySavings, availableForSavings),
        EmergencyFund: result.budgetAllocation?.EmergencyFund || Math.round(monthlyIncome * 0.05),
        DiscretionarySpending: result.budgetAllocation?.DiscretionarySpending || Math.max(0, monthlyIncome - monthlyExpenses - Math.min(requiredMonthlySavings, availableForSavings))
      },
      actionSteps: Array.isArray(result.actionSteps) ? result.actionSteps : [
        'Review and track all monthly expenses',
        'Set up automatic transfer to renovation savings account',
        'Look for areas to reduce discretionary spending'
      ],
      feasibilityAnalysis: result.feasibilityAnalysis || 
        (availableForSavings >= requiredMonthlySavings ? 
          'Your renovation goal is achievable within the target timeframe.' : 
          'Consider extending the timeframe or reducing the renovation scope to make this goal more realistic.'),
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        'Build an emergency fund of 3-6 months expenses',
        'Consider additional income sources if savings target is tight',
        'Get multiple contractor quotes to optimize renovation costs'
      ],
      savingsRate: result.savingsRate || Math.round((requiredMonthlySavings / monthlyIncome) * 100)
    };
  } catch (error) {
    console.error('Error generating budget plan:', error);
    throw new Error('Failed to generate budget plan');
  }
}

export async function calculateFlipROI(flipData: {
  purchasePrice: number;
  renovationCost: number;
  expectedSalePrice: number;
  holdingCost: number;
  sellingCosts: number;
  additionalExpenses: number;
}): Promise<{
  netProfit: number;
  roiPercentage: number;
  details: {
    totalInvestment: number;
    totalCosts: number;
    calculation: string;
    costBreakdown: {
      purchasePrice: number;
      renovationCost: number;
      holdingCost: number;
      sellingCosts: number;
      additionalExpenses: number;
    };
    profitMargin: number;
  };
  analysis: string;
  recommendations: string[];
  riskFactors: string[];
}> {
  try {
    const { purchasePrice, renovationCost, expectedSalePrice, holdingCost, sellingCosts, additionalExpenses } = flipData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a real estate investment analyst specializing in property flipping ROI calculations. Provide detailed financial analysis with actionable insights and risk assessments. Always output structured JSON without explanations outside the JSON."
        },
        {
          role: "user",
          content: `Calculate comprehensive ROI analysis for this property flip:

Purchase Price: $${purchasePrice.toLocaleString()}
Renovation Cost: $${renovationCost.toLocaleString()}
Expected Sale Price: $${expectedSalePrice.toLocaleString()}
Holding Costs: $${holdingCost.toLocaleString()}
Selling Costs: $${sellingCosts.toLocaleString()}
Additional Expenses: $${additionalExpenses.toLocaleString()}

Provide detailed analysis including:
1. Net profit calculation
2. ROI percentage (return on total investment)
3. Profit margin percentage
4. Investment viability analysis
5. Risk factors and mitigation strategies
6. Recommendations for improvement
7. Cost breakdown validation

Return JSON with this structure:
{
  "netProfit": number,
  "roiPercentage": number,
  "details": {
    "totalInvestment": number,
    "totalCosts": number,
    "calculation": string,
    "costBreakdown": {
      "purchasePrice": number,
      "renovationCost": number,
      "holdingCost": number,
      "sellingCosts": number,
      "additionalExpenses": number
    },
    "profitMargin": number
  },
  "analysis": string,
  "recommendations": [string],
  "riskFactors": [string]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Calculate fallback values for validation
    const totalCosts = purchasePrice + renovationCost + holdingCost + sellingCosts + additionalExpenses;
    const totalInvestment = purchasePrice + renovationCost + holdingCost + additionalExpenses; // Investment before sale
    const netProfit = expectedSalePrice - totalCosts;
    const roiPercentage = totalInvestment > 0 ? Math.round((netProfit / totalInvestment) * 100 * 100) / 100 : 0;
    const profitMargin = expectedSalePrice > 0 ? Math.round((netProfit / expectedSalePrice) * 100 * 100) / 100 : 0;
    
    return {
      netProfit: result.netProfit || netProfit,
      roiPercentage: result.roiPercentage || roiPercentage,
      details: {
        totalInvestment: result.details?.totalInvestment || totalInvestment,
        totalCosts: result.details?.totalCosts || totalCosts,
        calculation: result.details?.calculation || `(${expectedSalePrice} - ${totalCosts}) / ${totalInvestment} * 100`,
        costBreakdown: {
          purchasePrice,
          renovationCost,
          holdingCost,
          sellingCosts,
          additionalExpenses
        },
        profitMargin: result.details?.profitMargin || profitMargin
      },
      analysis: result.analysis || (roiPercentage > 15 ? 'This flip shows strong potential with above-average returns.' : roiPercentage > 0 ? 'This flip shows modest returns but may be viable.' : 'This flip shows negative returns and requires strategy adjustment.'),
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        roiPercentage < 10 ? 'Consider reducing renovation costs or increasing sale price expectations' : 'Monitor market conditions closely',
        'Get multiple contractor quotes to validate renovation costs',
        'Research comparable sales to confirm expected sale price'
      ],
      riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [
        'Market volatility could affect sale price',
        'Renovation costs may exceed estimates',
        'Extended holding period increases carrying costs'
      ]
    };
  } catch (error) {
    console.error('Error calculating flip ROI:', error);
    throw new Error('Failed to calculate flip ROI');
  }
}

export async function researchPermits(permitData: {
  projectDescription: string;
  projectLocation: string;
}): Promise<{
  permits: string[];
  estimatedTime: string;
  notes: string;
  requirements: Array<{
    permit: string;
    description: string;
    estimatedCost: string;
    processingTime: string;
  }>;
  inspectionSchedule: string[];
  additionalConsiderations: string[];
  contactInfo: string;
}> {
  try {
    const { projectDescription, projectLocation } = permitData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a building permit expert specializing in residential construction projects. Provide comprehensive permit guidance including requirements, timelines, costs, and inspection schedules. Output detailed JSON analysis with practical guidance for navigating the permit process."
        },
        {
          role: "user",
          content: `Research permit requirements for this construction project:

Project Description: ${projectDescription}
Project Location: ${projectLocation}

Provide comprehensive permit analysis including:
1. Required permits list
2. Estimated processing time for overall project
3. Individual permit requirements and costs
4. Inspection schedule and key milestones
5. Important notes and considerations
6. Contact information guidance
7. Common pitfalls to avoid

Return JSON with this structure:
{
  "permits": [string],
  "estimatedTime": string,
  "notes": string,
  "requirements": [{"permit": string, "description": string, "estimatedCost": string, "processingTime": string}],
  "inspectionSchedule": [string],
  "additionalConsiderations": [string],
  "contactInfo": string
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate location isn't too vague
    const isVagueLocation = projectLocation.toLowerCase().includes('usa') || 
                           projectLocation.toLowerCase() === 'us' ||
                           projectLocation.length < 5;
    
    if (isVagueLocation) {
      return {
        permits: [],
        estimatedTime: 'Unable to determine',
        notes: 'Please provide a specific city and state for accurate permit lookup. Permit requirements vary significantly by jurisdiction.',
        requirements: [],
        inspectionSchedule: [],
        additionalConsiderations: ['Location too vague for specific permit research'],
        contactInfo: 'Please specify your city and state to get local building department contact information.'
      };
    }
    
    return {
      permits: Array.isArray(result.permits) ? result.permits : ['Building Permit'],
      estimatedTime: result.estimatedTime || '4-6 weeks',
      notes: result.notes || 'Permit rules vary by jurisdiction. Always confirm with your local building department.',
      requirements: Array.isArray(result.requirements) ? result.requirements : [
        {
          permit: 'Building Permit',
          description: 'General construction permit for structural work',
          estimatedCost: '$200-$500',
          processingTime: '2-4 weeks'
        }
      ],
      inspectionSchedule: Array.isArray(result.inspectionSchedule) ? result.inspectionSchedule : [
        'Foundation inspection',
        'Rough-in inspection',
        'Final inspection'
      ],
      additionalConsiderations: Array.isArray(result.additionalConsiderations) ? result.additionalConsiderations : [
        'Schedule inspections well in advance',
        'Ensure all contractors are licensed',
        'Keep permit documents on-site during construction'
      ],
      contactInfo: result.contactInfo || 'Contact your local building department for specific requirements and fees.'
    };
  } catch (error) {
    console.error('Error researching permits:', error);
    throw new Error('Failed to research permits');
  }
}

export async function homeownerChat(chatData: {
  userQuestion: string;
  context?: {
    location?: string;
    renovationStage?: string;
    propertyType?: string;
    previousQuestions?: string[];
  };
}): Promise<{
  answer: string;
  nextSteps: string[];
  category: string;
  relatedTopics: string[];
  followUpSuggestions: string[];
}> {
  try {
    const { userQuestion, context } = chatData;
    
    // Validate question
    if (!userQuestion || userQuestion.trim().length === 0) {
      return {
        answer: "Please type your question to get helpful advice!",
        nextSteps: [],
        category: "General",
        relatedTopics: [],
        followUpSuggestions: ["Ask about planning your renovation", "Get help with contractor selection", "Learn about permits and regulations"]
      };
    }
    
    // Build context string if available
    let contextString = "";
    if (context?.location || context?.renovationStage || context?.propertyType) {
      const parts = [];
      if (context.propertyType) parts.push(`working on a ${context.propertyType}`);
      if (context.location) parts.push(`located in ${context.location}`);
      if (context.renovationStage) parts.push(`currently in ${context.renovationStage} stage`);
      contextString = parts.length > 0 ? `Context: User is ${parts.join(', ')}. ` : "";
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a friendly home renovation expert and concierge assistant. Use simple, encouraging language that homeowners can easily understand. Stay focused on renovation, construction, and home improvement topics. Always provide practical, actionable advice with specific next steps. Output structured JSON responses with helpful guidance."
        },
        {
          role: "user",
          content: `${contextString}User asks: "${userQuestion}"

Provide helpful renovation advice including:
1. Clear, friendly answer using simple language
2. Specific actionable next steps
3. Topic category for organization
4. Related topics they might be interested in
5. Follow-up question suggestions

Stay on topic - only answer renovation, construction, and home improvement questions. If the question is off-topic, politely redirect to renovation topics.

Return JSON with this structure:
{
  "answer": string,
  "nextSteps": [string],
  "category": string,
  "relatedTopics": [string],
  "followUpSuggestions": [string]
}`
        }
      ],
      temperature: 0.4, // Slightly higher for friendly, conversational tone
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize response
    return {
      answer: result.answer || "I'd be happy to help with your renovation question! Could you provide a bit more detail about what you're looking for?",
      nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [],
      category: result.category || "General",
      relatedTopics: Array.isArray(result.relatedTopics) ? result.relatedTopics : [],
      followUpSuggestions: Array.isArray(result.followUpSuggestions) ? result.followUpSuggestions : [
        "Ask about timeline planning",
        "Get help with budget planning",
        "Learn about contractor selection"
      ]
    };
  } catch (error) {
    console.error('Error in homeowner chat:', error);
    throw new Error('Failed to process homeowner chat');
  }
}

export async function generateProjectEstimate(estimateData: {
  userInput: string;
  area?: number;
  materialQuality?: string;
  timeline?: string;
  zipCode?: string;
  needsPermits?: boolean;
  permitTypes?: string;
  needsEquipment?: boolean;
  equipmentTypes?: string;
}): Promise<{
  Materials: Record<string, number>;
  Labor: Record<string, { hours: number; cost: number }>;
  "Permits & Fees": Record<string, number>;
  "Equipment & Overhead": Record<string, number>;
  "Profit & Contingency": Record<string, number>;
  TotalEstimate: number;
  Notes: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a construction cost estimator working for a full-service general contractor. You handle projects ranging from kitchen remodels and basement waterproofing to structural repair, interior finishes, and additions.

Your job is to take a natural-language project description and generate a detailed cost estimate. Include clear subtotals for materials, labor, permits, and equipment/overhead. Tailor the breakdown based on the project type — e.g.:

- Kitchen remodel: cabinets, countertops, flooring, plumbing, electrical, appliances
- Waterproofing: surface prep, patching, primer, membrane, sump systems
- Structural: steel column install, anchoring, framing, reinforcement
- Bathrooms: tiling, vanities, fixtures, waterproofing, wall board
- Additions: demo, framing, drywall, windows, siding, roofing, inspections

Always respond in clean JSON with totals per category. Use realistic labor hours and unit-based quantities where appropriate. Don't add commentary or Markdown — just output valid structured JSON. Make smart assumptions based on industry averages unless values are explicitly provided.`
        },
        {
          role: "user",
          content: `Estimate this project: "${estimateData.userInput}" 

${estimateData.area ? `Area: ${estimateData.area} sq ft` : ''}
${estimateData.materialQuality ? `Material Quality: ${estimateData.materialQuality}` : ''}
${estimateData.timeline ? `Timeline: ${estimateData.timeline}` : ''}
${estimateData.zipCode ? `Location: ${estimateData.zipCode}` : ''}
${estimateData.needsPermits ? `Permits Required: ${estimateData.permitTypes || 'Yes, include permit costs'}` : 'Permits Required: No permits needed'}
${estimateData.needsEquipment ? `Equipment Required: ${estimateData.equipmentTypes || 'Yes, include equipment costs'}` : 'Equipment Required: No special equipment needed'}

Break it down into these categories. Set permit costs to 0 if no permits are needed, and equipment costs to 0 if no equipment is needed:

{
  "Materials": {
    "Cabinets": 0,
    "Countertops": 0,
    "Appliances": 0,
    "Sink & Faucet": 0,
    "Flooring": 0,
    "Drywall & Paint": 0,
    "Waterproofing Supplies": 0,
    "Framing Materials": 0,
    "Steel Supports": 0,
    "Other": 0
  },
  "Labor": {
    "Demo & Prep": {"hours": 0, "cost": 0},
    "Cabinet Install": {"hours": 0, "cost": 0},
    "Countertop Install": {"hours": 0, "cost": 0},
    "Plumbing": {"hours": 0, "cost": 0},
    "Electrical": {"hours": 0, "cost": 0},
    "Flooring Install": {"hours": 0, "cost": 0},
    "Waterproofing": {"hours": 0, "cost": 0},
    "Structural Support Install": {"hours": 0, "cost": 0},
    "Project Management": {"hours": 0, "cost": 0}
  },
  "Permits & Fees": {
    "Building Permit": 0,
    "Electrical Permit": 0,
    "Plumbing Permit": 0,
    "Structural Permit": 0
  },
  "Equipment & Overhead": {
    "Tool Rental": 0,
    "Waste Disposal": 0,
    "Insurance & Overhead": 0
  },
  "Profit & Contingency": {
    "Profit": 0,
    "Contingency": 0
  },
  "TotalEstimate": 0,
  "Notes": "Summarize any assumptions, standard rates, or missing details that were inferred."
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error("Error generating project estimate:", error);
    return {
      "Materials": { "Other": 0 },
      "Labor": { "General Labor": {"hours": 0, "cost": 0} },
      "Permits & Fees": { "Building Permit": 0 },
      "Equipment & Overhead": { "Insurance & Overhead": 0 },
      "Profit & Contingency": { "Profit": 0, "Contingency": 0 },
      "TotalEstimate": 0,
      "Notes": "Unable to generate detailed estimate at this time. Please try again."
    };
  }
}

export async function generateBid(bidData: {
  clientName: string;
  projectTitle: string;
  location: string;
  projectScope: string;
  estimatedCost: number;
  timelineEstimate: string;
  paymentStructure: string;
  legalLanguagePreference: string;
}): Promise<{
  projectTitle: string;
  client: string;
  scopeSummary: string;
  estimatedCost: number;
  timeline: string;
  paymentTerms: string;
  legalClauses: string[];
  signatureBlock: string;
}> {
  try {
    const { clientName, projectTitle, location, projectScope, estimatedCost, timelineEstimate, paymentStructure, legalLanguagePreference } = bidData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a senior construction bid writer and contract consultant. Your role is to create polished, client-facing bid proposals for general contractors. These must be clear and legally sound, include all critical elements of a proposal (title, scope, payment terms, legal clauses), adapt to formal or casual tone based on user preference, and include a signature section. You must always return a valid, well-formatted JSON object. Do not include commentary or explanation — just output structured JSON."
        },
        {
          role: "user",
          content: `Generate a complete bid proposal document using the following details:

Client Name: ${clientName}
Project Title: ${projectTitle}
Location: ${location}
Project Scope: ${projectScope}
Estimated Cost: $${estimatedCost}
Timeline: ${timelineEstimate}
Preferred Payment Structure: ${paymentStructure}
Legal Language Style: ${legalLanguagePreference} (formal or casual)

The output should include:
- A professional title
- A summarized project scope section (rewrite the project scope into polished form)
- A payment terms paragraph
- At least 3 legal disclaimers or contract clauses
- A signature section (blank lines for signing)

Return JSON in this exact format:
{
  "projectTitle": "string",
  "client": "string", 
  "scopeSummary": "string",
  "estimatedCost": number,
  "timeline": "string",
  "paymentTerms": "string",
  "legalClauses": ["string", "string", "string"],
  "signatureBlock": "string"
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      projectTitle: result.projectTitle || `${projectTitle} - ${location}`,
      client: result.client || clientName,
      scopeSummary: result.scopeSummary || projectScope,
      estimatedCost: result.estimatedCost || estimatedCost,
      timeline: result.timeline || timelineEstimate,
      paymentTerms: result.paymentTerms || paymentStructure,
      legalClauses: Array.isArray(result.legalClauses) ? result.legalClauses : [
        "Contractor shall not be liable for delays due to weather or supply chain interruptions.",
        "Client agrees to provide site access during regular work hours.",
        "Change orders must be documented in writing and may incur additional cost."
      ],
      signatureBlock: result.signatureBlock || "Accepted by: _______________  Date: ___________"
    };
  } catch (error) {
    console.error('Error generating bid:', error);
    throw new Error('Failed to generate bid');
  }
}

export async function constructionAssistant(assistantData: {
  question: string;
  projectContext: string;
  buildingCodeReference?: string;
}): Promise<{
  topInsight: string;
  details: string;
  resources: string[];
  rfi?: {
    to: string;
    subject: string;
    body: string;
  };
  warnings: string[];
  nextSteps: string[];
  codeCompliance: string;
  expertise: string;
}> {
  try {
    const { question, projectContext, buildingCodeReference } = assistantData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction expert with specialized knowledge in project management, code compliance, and construction best practices. Provide precise, code-compliant answers with proper citations when applicable. Generate professional RFI formats when clarification is needed. Always prioritize safety and code compliance. Output structured JSON with professional construction guidance."
        },
        {
          role: "user",
          content: `Answer this construction question with expert guidance:

Question: "${question}"
Project Context: ${projectContext}
${buildingCodeReference ? `Building Code Reference: ${buildingCodeReference}` : ''}

Provide comprehensive professional analysis including:
1. Clear, authoritative answer with code compliance considerations
2. Detailed explanation with technical specifics
3. Relevant code sections, standards, or resources
4. Professional RFI format if clarification from authorities is needed
5. Important warnings and safety considerations
6. Actionable next steps for implementation
7. Code compliance assessment
8. Expert role identification (project manager, code officer, etc.)

If you don't have sufficient information about local codes, clearly state this and recommend consulting local authorities.

Return JSON with this structure:
{
  "topInsight": string,
  "details": string,
  "resources": [string],
  "rfi": {"to": string, "subject": string, "body": string} (optional),
  "warnings": [string],
  "nextSteps": [string],
  "codeCompliance": string,
  "expertise": string
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      topInsight: result.topInsight || "Expert construction guidance provided based on available information.",
      details: result.details || "Please provide more specific project details for more targeted advice.",
      resources: Array.isArray(result.resources) ? result.resources : [],
      rfi: result.rfi ? {
        to: result.rfi.to || "Local Building Department",
        subject: result.rfi.subject || "Construction Code Clarification Request",
        body: result.rfi.body || "Please provide clarification on the specific requirements for this project."
      } : undefined,
      warnings: Array.isArray(result.warnings) ? result.warnings : [
        "Always confirm requirements with local building authorities",
        "Consult licensed professionals for specific implementations",
        "Verify current code versions and local amendments"
      ],
      nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [
        "Contact local building department for verification",
        "Consult with licensed contractor if needed",
        "Review project plans with relevant codes"
      ],
      codeCompliance: result.codeCompliance || "Code compliance assessment requires local authority verification.",
      expertise: result.expertise || "General Construction Expert"
    };
  } catch (error) {
    console.error('Error in construction assistant:', error);
    throw new Error('Failed to process construction assistance request');
  }
}

export async function getAIFlipOpinion(propertyData: {
  address: string;
  zipCode: string;
  price: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  daysOnMarket: number;
  description: string;
  projectType: string;
  yearBuilt?: number;
}): Promise<{
  flipScore: number;
  analysis: string;
  renovationBudgetEstimate: string;
  projectedResaleValue: string;
  recommendation: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a highly experienced real estate investor and licensed general contractor with 15+ years of experience successfully flipping homes across multiple U.S. markets. You have completed over 200 flips and have deep expertise in market analysis, renovation cost estimation, and profit maximization.

Your job is to provide a detailed, investment-grade flip analysis (500-700 words) for each property listing. Analyze these critical factors:

**Property Analysis Framework:**
- Price vs. local comps and average $/sqft for the ZIP code
- Square footage efficiency and layout optimization potential
- Bedroom/bathroom configuration vs. market demand
- Days on market implications (DOM >30 = potential issues)
- Listing description red flags and condition assumptions
- If build year unknown, assume 1990s finishes needing updates

**Market & Financial Analysis:**
- Cross-reference with local comparable sales and market trends
- Estimate ZIP code-specific average renovation costs ($/sqft)
- Calculate realistic ARV (after-repair value) based on local comps
- Factor in all costs: renovation + 6% sales fees + 10% contingency buffer
- Assess profit margins and ROI potential

**Renovation Scope Assessment:**
- Identify likely renovation needs based on age and description
- Estimate costs for: kitchen, bathrooms, flooring, paint, HVAC, electrical
- Flag potential structural issues or layout problems
- Consider curb appeal and exterior improvements needed

**Risk Assessment:**
- Market timing and absorption rates
- Over-improvement risks for the neighborhood
- Permit requirements and timeline implications
- Competition analysis and buyer demand

**Required Output Format:**
Provide a multi-paragraph narrative that covers:
1. Market positioning analysis (price vs. comps, DOM assessment)
2. Property condition assessment and renovation scope
3. Financial projections with detailed cost breakdown
4. Risk factors and mitigation strategies
5. Final recommendation with clear rationale

Return as JSON:
{
  "flipScore": 1-10,
  "analysis": "[Detailed 500-700 word investment analysis]",
  "renovationBudgetEstimate": "$XX,000–$YY,000",
  "projectedResaleValue": "$XXX,000–$XXX,000",
  "estimatedProfitAfterFees": "$XX,000–$XX,000",
  "recommendation": "✅ Green / ⚠️ Yellow / ❌ Red — [Specific reasoning]"
}`
        },
        {
          role: "user",
          content: `Analyze this property for flip potential:

Address: ${propertyData.address}
ZIP Code: ${propertyData.zipCode}
Price: $${propertyData.price.toLocaleString()}
Square Footage: ${propertyData.squareFootage} sq ft
Bedrooms/Bathrooms: ${propertyData.bedrooms}bd/${propertyData.bathrooms}ba
Days on Market: ${propertyData.daysOnMarket}
Year Built: ${propertyData.yearBuilt || 'Unknown'}
Project Type: ${propertyData.projectType}
Description: ${propertyData.description}

Provide your expert flip analysis with score, professional opinion, budget estimates, and recommendation.`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{}';
    console.log('AI Response content:', content); // Debug logging
    
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Return fallback analysis if JSON parsing fails
      return {
        flipScore: 6,
        analysis: `This property shows moderate flip potential based on the $${propertyData.price.toLocaleString()} asking price and ${propertyData.squareFootage} sq ft. Market conditions in ${propertyData.zipCode} are stable. Consider kitchen and bathroom updates as primary value-add opportunities. The ${propertyData.daysOnMarket} days on market suggests reasonable pricing, though thorough inspection is recommended before proceeding.`,
        renovationBudgetEstimate: "$35,000–$55,000",
        projectedResaleValue: `$${Math.round(propertyData.price * 1.25).toLocaleString()}–$${Math.round(propertyData.price * 1.35).toLocaleString()}`,
        recommendation: "⚠️ Yellow — Promising but Needs Due Diligence"
      };
    }
    
    return {
      flipScore: result.flipScore || 6,
      analysis: result.analysis || `This property at ${propertyData.address} shows potential for house flipping based on current market conditions. The ${propertyData.squareFootage} sq ft layout and ${propertyData.bedrooms}/${propertyData.bathrooms} configuration are solid fundamentals. Consider focusing renovation efforts on high-impact areas like kitchen and bathrooms to maximize ROI potential.`,
      renovationBudgetEstimate: result.renovationBudgetEstimate || "$35,000–$55,000",
      projectedResaleValue: result.projectedResaleValue || `$${Math.round(propertyData.price * 1.25).toLocaleString()}–$${Math.round(propertyData.price * 1.35).toLocaleString()}`,
      estimatedProfitAfterFees: result.estimatedProfitAfterFees || `$${Math.round(propertyData.price * 0.15).toLocaleString()}–$${Math.round(propertyData.price * 0.25).toLocaleString()}`,
      recommendation: result.recommendation || "⚠️ Yellow — Needs Further Analysis"
    };
  } catch (error) {
    console.error('Error generating AI flip opinion:', error);
    
    // Return structured fallback response instead of throwing error
    return {
      flipScore: 5,
      analysis: `Property analysis for ${propertyData.address} requires manual review. Based on the $${propertyData.price.toLocaleString()} asking price and ${propertyData.squareFootage} sq ft, this property warrants consideration. Recommend conducting thorough market analysis and property inspection to determine renovation scope and profit potential.`,
      renovationBudgetEstimate: "$30,000–$60,000",
      projectedResaleValue: `$${Math.round(propertyData.price * 1.2).toLocaleString()}–$${Math.round(propertyData.price * 1.4).toLocaleString()}`,
      recommendation: "⚠️ Yellow — Manual Analysis Required"
    };
  }
}

export async function generateMarketInsights(zipCode: string): Promise<{
  zipCode: string;
  summary: string;
  lastUpdated: string;
  cacheTimestamp: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a real estate market analyst with expertise in local market conditions, property values, and investment trends. Provide comprehensive market insights for any given ZIP code including market trends, property value ranges, neighborhood characteristics, and investment opportunities.

Generate detailed market analysis covering:
- Current market conditions and trends
- Typical property value ranges and price per square foot
- Neighborhood characteristics and amenities
- School districts and local services
- Transportation and accessibility
- Investment potential and market outlook
- Renovation trends and popular home styles
- Local market challenges and opportunities

Provide practical, data-driven insights that would be valuable for property investors and homeowners.`
        },
        {
          role: "user",
          content: `Generate comprehensive local market insights for ZIP code ${zipCode}. Include:

1. Market overview and current conditions
2. Property value trends and typical price ranges
3. Neighborhood characteristics and demographics
4. Local amenities, schools, and services
5. Transportation and accessibility
6. Investment opportunities and market outlook
7. Popular renovation trends in the area
8. Key considerations for buyers and investors

Format as a detailed but readable analysis (300-400 words) that provides actionable market intelligence.`
        }
      ],
      temperature: 0.3
    });

    const summary = response.choices[0].message.content || `Market analysis for ZIP ${zipCode} shows stable conditions with moderate investment potential. Local amenities and transportation access provide good fundamentals for property values. Consider focusing on kitchen and bathroom renovations to align with current buyer preferences in this market.`;

    return {
      zipCode,
      summary,
      lastUpdated: new Date().toLocaleDateString(),
      cacheTimestamp: Date.now()
    };
  } catch (error) {
    console.error('Error generating market insights:', error);
    
    // Return structured fallback response
    return {
      zipCode,
      summary: `Market insights for ZIP ${zipCode}: This area represents a stable residential market with typical suburban characteristics. Property values show consistent trends with the broader regional market. Local amenities include schools, shopping, and transportation access. Investment opportunities focus on single-family homes with renovation potential. Consider kitchen and bathroom updates as primary value drivers in this market. Market conditions support moderate appreciation with proper property selection and improvements.`,
      lastUpdated: new Date().toLocaleDateString(),
      cacheTimestamp: Date.now()
    };
  }
}

export async function analyzeFlipProperties(flipData: {
  location: string;
  maxBudget: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  currentCondition: string;
  renovationBudget: number;
  numberOfListings: number;
}): Promise<{
  listings: Array<{
    address: string;
    specs: {
      bedrooms: number;
      bathrooms: number;
      squareFeet: number;
      yearBuilt: number;
      lotSize: number;
    };
    askingPrice: number;
    estimatedARV: number;
    renovationCost: number;
    flipScore: number;
    roi: string;
    suggestedImprovements: string[];
    warnings: string[];
    marketTrends: string;
    investmentRisk: string;
  }>;
  topInsight: string;
  summaryMarkdown: string;
  warnings: string[];
  marketAnalysis: string;
  investmentStrategy: string;
}> {
  try {
    const { location, maxBudget, bedrooms, bathrooms, squareFeet, lotSize, currentCondition, renovationBudget, numberOfListings } = flipData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a real estate investment advisor and AI property analyst with expertise in house flipping, market analysis, and renovation ROI calculations. Generate realistic but fictional property listings that match investment criteria. Calculate comprehensive flip scores based on purchase price, renovation costs, ARV potential, and market conditions. Always include clear disclaimers that listings are hypothetical examples for planning purposes. Provide actionable investment insights and renovation strategies."
        },
        {
          role: "user",
          content: `Generate ${numberOfListings} realistic fictional property listings for house flipping analysis:

Location: ${location}
Maximum Budget: $${maxBudget.toLocaleString()}
Target: ${bedrooms} bed, ${bathrooms} bath
Square Feet: ~${squareFeet} sqft
Lot Size: ~${lotSize} acres
Current Condition: ${currentCondition}
Available Renovation Budget: $${renovationBudget.toLocaleString()}

For each property, provide comprehensive flip analysis including:
1. Realistic address and property specifications
2. Current asking price within budget constraints
3. Estimated After Repair Value (ARV) based on comparable sales
4. Detailed renovation cost breakdown
5. Flip Score (1-100) based on profit potential, market conditions, and risk factors
6. ROI percentage and timeline projections
7. Specific renovation recommendations with priority ranking
8. Market trend analysis and investment risk assessment
9. Professional warnings and considerations

Focus on properties with strong flip potential while maintaining realistic market pricing and renovation costs.

Return JSON with this structure:
{
  "listings": [{"address": string, "specs": {"bedrooms": number, "bathrooms": number, "squareFeet": number, "yearBuilt": number, "lotSize": number}, "askingPrice": number, "estimatedARV": number, "renovationCost": number, "flipScore": number, "roi": string, "suggestedImprovements": [string], "warnings": [string], "marketTrends": string, "investmentRisk": string}],
  "topInsight": string,
  "summaryMarkdown": string,
  "warnings": [string],
  "marketAnalysis": string,
  "investmentStrategy": string
}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Generate fallback listings if needed
    const defaultListings = Array.from({ length: numberOfListings }, (_, i) => ({
      address: `${123 + i * 100} Investment Ave, ${location}`,
      specs: {
        bedrooms,
        bathrooms,
        squareFeet,
        yearBuilt: 1980 + Math.floor(Math.random() * 30),
        lotSize
      },
      askingPrice: Math.round(maxBudget * (0.8 + Math.random() * 0.2)),
      estimatedARV: Math.round(maxBudget * (1.2 + Math.random() * 0.3)),
      renovationCost: Math.round(renovationBudget * (0.7 + Math.random() * 0.6)),
      flipScore: 60 + Math.floor(Math.random() * 30),
      roi: `${15 + Math.floor(Math.random() * 15)}%`,
      suggestedImprovements: ['Kitchen renovation', 'Bathroom updates', 'Flooring replacement', 'Paint interior/exterior'],
      warnings: ['This is a fictional listing for planning purposes only'],
      marketTrends: 'Stable market conditions with moderate appreciation potential',
      investmentRisk: 'Medium risk - standard renovation timeline and costs'
    }));
    
    return {
      listings: Array.isArray(result.listings) ? result.listings.map((listing: any) => ({
        address: listing.address || `Property in ${location}`,
        specs: {
          bedrooms: listing.specs?.bedrooms || bedrooms,
          bathrooms: listing.specs?.bathrooms || bathrooms,
          squareFeet: listing.specs?.squareFeet || squareFeet,
          yearBuilt: listing.specs?.yearBuilt || 1985,
          lotSize: listing.specs?.lotSize || lotSize
        },
        askingPrice: Number(listing.askingPrice) || maxBudget,
        estimatedARV: Number(listing.estimatedARV) || Math.round(maxBudget * 1.25),
        renovationCost: Number(listing.renovationCost) || renovationBudget,
        flipScore: Number(listing.flipScore) || 70,
        roi: listing.roi || '18%',
        suggestedImprovements: Array.isArray(listing.suggestedImprovements) ? listing.suggestedImprovements : ['Kitchen updates', 'Bathroom renovation'],
        warnings: Array.isArray(listing.warnings) ? listing.warnings : ['This is a fictional listing for planning purposes only'],
        marketTrends: listing.marketTrends || 'Market analysis based on current trends',
        investmentRisk: listing.investmentRisk || 'Standard investment risk factors apply'
      })) : defaultListings,
      topInsight: result.topInsight || `Found ${numberOfListings} potential flip properties in ${location} within your $${maxBudget.toLocaleString()} budget.`,
      summaryMarkdown: result.summaryMarkdown || `Investment analysis shows promising opportunities in ${location} market. Focus on properties requiring cosmetic improvements for best ROI potential. Consider current market conditions and renovation timeline when making final decisions.`,
      warnings: Array.isArray(result.warnings) ? result.warnings : [
        'All property listings are fictional examples for planning purposes only',
        'Consult with real estate professionals before making investment decisions',
        'Market conditions and property values can change rapidly',
        'Always perform thorough due diligence on actual properties'
      ],
      marketAnalysis: result.marketAnalysis || `${location} market shows stability with moderate growth potential. Consider local economic factors and neighborhood trends when evaluating investment opportunities.`,
      investmentStrategy: result.investmentStrategy || 'Focus on properties with strong bones requiring primarily cosmetic improvements. Target 15-25% ROI with 6-12 month timeline for optimal returns.'
    };
  } catch (error) {
    console.error('Error analyzing flip properties:', error);
    throw new Error('Failed to analyze flip properties');
  }
}

export async function analyzePropertyFromUrl(url: string, isConsumerMode: boolean): Promise<{
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  daysOnMarket: number;
  zipCode: string;
  description: string;
  estimatedARV: number;
  renovationScope: string;
  aiAnalysis: string;
}> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Analyze this property listing URL and extract detailed information: ${url}

You are an expert real estate analyst. Based on the URL provided, please analyze what you can determine about this property and provide:

1. Property Details:
   - Address (estimate based on URL if exact not available)
   - Price (estimate market value if not available)
   - Square footage (estimate if not available)
   - Bedrooms and bathrooms (estimate if not available)
   - Property type (Single Family, Condo, etc.)
   - Days on market (estimate if not available)
   - ZIP code (extract or estimate from URL)

2. Investment Analysis:
   - Estimated After Repair Value (ARV)
   - Renovation scope needed (Cosmetic, Moderate, Full Gut)
   - Detailed investment analysis paragraph

Provide realistic estimates based on the URL and typical market data. If this is from Zillow, Realtor.com, or similar sites, provide comprehensive analysis.

Format as JSON with all the fields listed above including a detailed aiAnalysis paragraph.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert real estate investment analyst. Provide realistic property analysis based on available information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      address: result.address || "Property from URL",
      price: result.price || 450000,
      sqft: result.sqft || 1800,
      bedrooms: result.bedrooms || 3,
      bathrooms: result.bathrooms || 2,
      propertyType: result.propertyType || "Single Family",
      daysOnMarket: result.daysOnMarket || 15,
      zipCode: result.zipCode || "00000",
      description: result.description || "Property analyzed from URL",
      estimatedARV: result.estimatedARV || 650000,
      renovationScope: result.renovationScope || "Moderate",
      aiAnalysis: result.aiAnalysis || "This property shows solid investment potential based on the listing information. Market conditions and location factors suggest good appreciation potential."
    };
  } catch (error) {
    console.error('Error analyzing property URL:', error);
    return {
      address: "Property from URL",
      price: 450000,
      sqft: 1800,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: "Single Family",
      daysOnMarket: 15,
      zipCode: "00000",
      description: "Property analyzed from URL",
      estimatedARV: 650000,
      renovationScope: "Moderate",
      aiAnalysis: "Unable to analyze this property URL at the moment. Please try again or provide a different URL."
    };
  }
}

export async function compareContractorQuotes(quoteData: {
  quotes: Array<{
    contractorName: string;
    amount: number;
    timeline: string;
    description: string;
  }>;
  projectType: string;
  zipCode: string;
}): Promise<{
  analysis: string;
  recommendedQuote: number;
  quoteInsights: Array<{
    quoteId: number;
    rating: 'excellent' | 'good' | 'caution' | 'warning';
    notes: string[];
  }>;
  marketInsights: string;
}> {
  try {
    const { quotes, projectType, zipCode } = quoteData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction contract evaluation expert specializing in quote analysis and contractor assessment. Provide objective analysis of contractor quotes with focus on value, quality indicators, and potential risks. Output structured JSON with professional evaluation guidance."
        },
        {
          role: "user",
          content: `Analyze these contractor quotes for comparison:

Project Type: ${projectType}
Location: ${zipCode}

Quotes:
${quotes.map((quote, index) => 
  `Quote ${index + 1}: ${quote.contractorName}
  Amount: $${quote.amount.toLocaleString()}
  Timeline: ${quote.timeline}
  Description: ${quote.description}`
).join('\n\n')}

Provide comprehensive quote analysis including:
1. Overall analysis of the quote spread and market positioning
2. Recommendation for best value quote (by index number)
3. Individual quote insights with ratings and specific notes
4. Market insights for this type of project in this area

Rate each quote as: excellent, good, caution, or warning

Return JSON with this structure:
{
  "analysis": string,
  "recommendedQuote": number,
  "quoteInsights": [{"quoteId": number, "rating": string, "notes": [string]}],
  "marketInsights": string
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    const amounts = quotes.map(q => q.amount);
    const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    
    return {
      analysis: result.analysis || `Analyzed ${quotes.length} quotes. Consider factors beyond just price when making your decision.`,
      recommendedQuote: result.recommendedQuote || 0,
      quoteInsights: Array.isArray(result.quoteInsights) ? result.quoteInsights : quotes.map((_, index) => ({
        quoteId: index,
        rating: 'good',
        notes: ['Verify contractor credentials and references']
      })),
      marketInsights: result.marketInsights || `${projectType} projects in ${zipCode} show typical market pricing.`
    };
  } catch (error) {
    console.error('Error comparing contractor quotes:', error);
    throw new Error('Failed to compare contractor quotes');
  }
}

export async function generateCostSavingTips(expenseData: {
  totalSpent: number;
  categoryBreakdown: {
    Materials: number;
    Labor: number;
    Permits: number;
    Subs: number;
    Misc: number;
  };
  projectType: string;
  location: string;
}): Promise<Array<{
  category: string;
  tip: string;
  potentialSavings: string;
  priority: 'high' | 'medium' | 'low';
}>> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Analyze these construction project expenses and provide cost-saving recommendations:

Total Spent: $${expenseData.totalSpent.toLocaleString()}
Category Breakdown:
- Materials: $${expenseData.categoryBreakdown.Materials.toLocaleString()}
- Labor: $${expenseData.categoryBreakdown.Labor.toLocaleString()}
- Permits: $${expenseData.categoryBreakdown.Permits.toLocaleString()}
- Subcontractors: $${expenseData.categoryBreakdown.Subs.toLocaleString()}
- Miscellaneous: $${expenseData.categoryBreakdown.Misc.toLocaleString()}

Project Type: ${expenseData.projectType}
Location: ${expenseData.location}

Provide 3-5 actionable cost-saving tips based on the spending patterns. Focus on:
1. High-spend categories that are above market norms
2. Specific vendor or sourcing recommendations
3. Process improvements to reduce costs
4. Alternative approaches or materials

Format as JSON array with fields: category, tip, potentialSavings, priority (high/medium/low).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert construction cost analyst. Provide specific, actionable cost-saving recommendations based on spending patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{"tips": []}');
    
    return result.tips || [
      {
        category: "Materials",
        tip: "Consider bulk purchasing for frequently used materials to negotiate better rates with suppliers.",
        potentialSavings: "$2,000-5,000",
        priority: "medium"
      },
      {
        category: "Labor",
        tip: "Review labor rates against local market standards and consider alternative sourcing for specialized work.",
        potentialSavings: "$3,000-8,000",
        priority: "high"
      }
    ];
  } catch (error) {
    console.error('Error generating cost-saving tips:', error);
    return [
      {
        category: "General",
        tip: "Track expenses more consistently to identify cost-saving opportunities through detailed analysis.",
        potentialSavings: "$1,000-3,000",
        priority: "medium"
      }
    ];
  }
}

export async function analyzeExpenseVariance(projectData: {
  estimated: any;
  actual: any;
  projectType: string;
}): Promise<{
  analysis: string;
  riskFactors: string[];
  recommendations: string[];
}> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Analyze this construction project budget variance:

Estimated Budget:
- Materials: $${projectData.estimated.Materials?.toLocaleString() || '0'}
- Labor: $${projectData.estimated.Labor?.toLocaleString() || '0'}
- Permits: $${projectData.estimated.Permits?.toLocaleString() || '0'}
- Subcontractors: $${projectData.estimated.Subs?.toLocaleString() || '0'}
- Miscellaneous: $${projectData.estimated.Misc?.toLocaleString() || '0'}
- Total: $${projectData.estimated.total?.toLocaleString() || '0'}

Actual Expenses:
- Materials: $${projectData.actual.Materials?.toLocaleString() || '0'}
- Labor: $${projectData.actual.Labor?.toLocaleString() || '0'}
- Permits: $${projectData.actual.Permits?.toLocaleString() || '0'}
- Subcontractors: $${projectData.actual.Subs?.toLocaleString() || '0'}
- Miscellaneous: $${projectData.actual.Misc?.toLocaleString() || '0'}
- Total: $${projectData.actual.total?.toLocaleString() || '0'}

Project Type: ${projectData.projectType}

Provide detailed analysis including:
1. Overall budget performance assessment
2. Category-specific variance analysis
3. Risk factors for budget overruns
4. Specific recommendations to control costs

Format as JSON with analysis, riskFactors array, and recommendations array.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a construction project budget analyst. Provide detailed variance analysis with actionable insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      analysis: result.analysis || "Budget analysis shows mixed performance across categories with opportunities for improvement.",
      riskFactors: result.riskFactors || ["Incomplete expense tracking", "Market price volatility"],
      recommendations: result.recommendations || ["Implement more detailed expense tracking", "Review vendor contracts regularly"]
    };
  } catch (error) {
    console.error('Error analyzing expense variance:', error);
    return {
      analysis: "Unable to complete detailed variance analysis at this time.",
      riskFactors: ["Data insufficient for analysis"],
      recommendations: ["Ensure complete expense documentation for better analysis"]
    };
  }
}