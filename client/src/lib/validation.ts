// Input validation utilities for error handling reinforcement

export const validateZipCode = (zipCode: string): { isValid: boolean; error?: string } => {
  if (!zipCode || zipCode.trim().length === 0) {
    return { isValid: false, error: 'ZIP code is required' };
  }
  
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length !== 5) {
    return { isValid: false, error: 'ZIP code must be 5 digits' };
  }
  
  return { isValid: true };
};

export const validateNumericInput = (value: string | number, field: string, min?: number, max?: number): { isValid: boolean; error?: string } => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, error: `${field} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${field} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${field} cannot exceed ${max}` };
  }
  
  return { isValid: true };
};

// Safe API response parser with fallback handling
export const safeParseApiResponse = async (response: Response, fallbackData: any = {}) => {
  try {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API response parsing failed:', error);
    return { 
      success: false, 
      data: fallbackData,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Handle markdown code fences in JSON responses
export const cleanJsonResponse = (content: string): string => {
  return content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
};