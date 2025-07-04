export type BidInput = {
    clientName: string;
    projectTitle: string;
    location: string;
    projectScope: string;
    estimatedCost: number;
    timelineEstimate: string;
    paymentStructure: string;
    legalLanguagePreference: string;
};


export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};