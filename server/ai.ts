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
1. Task durations in weeks (realistic estimates)
2. Sequential task ordering with proper dependencies
3. Start and end weeks for each task
4. Task categories (structural, mechanical, finishing, etc.)
5. Critical path identification
6. Total project duration
7. Project completion date
8. Timeline optimization recommendations

Return JSON with this structure:
{
  "timeline": [{"task": string, "durationWeeks": number, "startWeek": number, "endWeek": number, "category": string, "dependencies": [string], "criticalPath": boolean}],
  "totalDuration": number,
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
  projectType: string;
  buildingType: string;
  location: string;
  squareFeet: number;
  stories: number;
  scopeOfWork: string;
  qualityLevel: string;
  timelineMonths: number;
}): Promise<{
  topInsight: string;
  lineItems: Array<{
    task: string;
    quantity: string;
    unit: string;
    unitCost: number;
    total: number;
    category: string;
  }>;
  totalCost: number;
  summaryMarkdown: string;
  warnings: string[];
  costPerSqft: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    overhead: number;
  };
  recommendations: string[];
}> {
  try {
    const { projectType, buildingType, location, squareFeet, stories, scopeOfWork, qualityLevel, timelineMonths } = estimateData;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an experienced construction cost estimator with expertise in RSMeans-style unit pricing and construction cost analysis. Use realistic US construction costs adjusted for location. Provide detailed cost breakdowns with accurate unit prices, quantities, and totals. Output structured JSON with professional construction estimates.`
        },
        {
          role: "user",
          content: `Generate a detailed professional construction estimate for this project:

Project Type: ${projectType}
Building Type: ${buildingType}
Location: ${location}
Size: ${squareFeet.toLocaleString()} square feet
Stories: ${stories}
Scope of Work: ${scopeOfWork}
Quality Level: ${qualityLevel}
Timeline: ${timelineMonths} months

Provide comprehensive cost analysis including:
1. Detailed line items with realistic quantities, unit costs, and totals
2. Task breakdown by construction phase (demo, foundation, framing, roofing, electrical, HVAC, plumbing, finishes)
3. Cost per square foot calculation
4. Materials vs labor cost breakdown
5. Location-adjusted pricing
6. Quality level considerations
7. Timeline impact on costs
8. Professional warnings and recommendations

Return JSON with this structure:
{
  "topInsight": string,
  "lineItems": [{"task": string, "quantity": string, "unit": string, "unitCost": number, "total": number, "category": string}],
  "totalCost": number,
  "summaryMarkdown": string,
  "warnings": [string],
  "costPerSqft": number,
  "breakdown": {"materials": number, "labor": number, "permits": number, "overhead": number},
  "recommendations": [string]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Calculate fallback values
    const baseCostPerSqft = qualityLevel.toLowerCase().includes('high') ? 200 : 
                           qualityLevel.toLowerCase().includes('luxury') ? 300 : 150;
    const estimatedTotal = squareFeet * baseCostPerSqft;
    const calculatedCostPerSqft = result.totalCost ? Math.round(result.totalCost / squareFeet) : baseCostPerSqft;
    
    return {
      topInsight: result.topInsight || `Estimated total cost is $${estimatedTotal.toLocaleString()} for this ${qualityLevel.toLowerCase()} ${buildingType.toLowerCase()} project.`,
      lineItems: Array.isArray(result.lineItems) ? result.lineItems.map((item: any) => ({
        task: item.task || 'Construction Task',
        quantity: item.quantity || '1',
        unit: item.unit || 'lot',
        unitCost: Number(item.unitCost) || 0,
        total: Number(item.total) || 0,
        category: item.category || 'General'
      })) : [],
      totalCost: result.totalCost || estimatedTotal,
      summaryMarkdown: result.summaryMarkdown || `This ${qualityLevel.toLowerCase()} ${stories}-story ${buildingType.toLowerCase()} in ${location} is estimated at $${calculatedCostPerSqft} per square foot.`,
      warnings: Array.isArray(result.warnings) ? result.warnings : [
        'Costs are estimates only and may vary based on local market conditions',
        'Get multiple contractor quotes for accurate pricing',
        'Permit costs not included - check with local building department'
      ],
      costPerSqft: calculatedCostPerSqft,
      breakdown: {
        materials: result.breakdown?.materials || Math.round(estimatedTotal * 0.40),
        labor: result.breakdown?.labor || Math.round(estimatedTotal * 0.35),
        permits: result.breakdown?.permits || Math.round(estimatedTotal * 0.05),
        overhead: result.breakdown?.overhead || Math.round(estimatedTotal * 0.20)
      },
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        'Consider getting detailed quotes from 3-5 contractors',
        'Factor in 10-15% contingency for unexpected costs',
        'Review scope of work carefully to avoid change orders'
      ]
    };
  } catch (error) {
    console.error('Error generating project estimate:', error);
    throw new Error('Failed to generate project estimate');
  }
}