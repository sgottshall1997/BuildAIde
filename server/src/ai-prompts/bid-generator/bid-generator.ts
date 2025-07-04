import { BidInput } from "@server/types/types-for-prompts"


export const bidGeneratorPrompt = ({
    clientName,
    projectTitle,
    location,
    projectScope,
    estimatedCost,
    timelineEstimate,
    paymentStructure,
    legalLanguagePreference
}: BidInput) => {
    return `Generate a complete bid proposal document using the following details:

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