import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Validation rules
export const validationRules = {
  required: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value) && value > 0;
    return value != null && value !== '';
  },
  
  number: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && isFinite(num);
  },
  
  positiveNumber: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && isFinite(num) && num > 0;
  },
  
  zipCode: (value: string) => {
    return /^\d{5}(-\d{4})?$/.test(value.trim());
  },
  
  email: (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  },
  
  minLength: (min: number) => (value: string) => {
    return value.trim().length >= min;
  },
  
  maxLength: (max: number) => (value: string) => {
    return value.trim().length <= max;
  },
  
  range: (min: number, max: number) => (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num >= min && num <= max;
  }
};

// Error messages
export const errorMessages = {
  required: 'This field is required',
  number: 'Please enter a valid number',
  positiveNumber: 'Please enter a positive number',
  zipCode: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  range: (min: number, max: number) => `Must be between ${min} and ${max}`
};

// Field validation hook
export function useFieldValidation(initialValues: Record<string, any> = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any, rules: any[]) => {
    for (const rule of rules) {
      if (typeof rule === 'function') {
        if (!rule(value)) {
          return typeof rule.message === 'function' ? rule.message() : rule.message || 'Invalid value';
        }
      } else if (typeof rule === 'object' && rule.validator) {
        if (!rule.validator(value)) {
          return rule.message || 'Invalid value';
        }
      }
    }
    return '';
  };

  const validateAllFields = (validationSchema: Record<string, any[]>) => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(validationSchema).forEach(fieldName => {
      const value = values[fieldName];
      const rules = validationSchema[fieldName];
      const error = validateField(fieldName, value, rules);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const touchField = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    updateField,
    touchField,
    validateAllFields,
    reset,
    hasErrors: Object.keys(errors).length > 0,
    isValid: Object.keys(errors).length === 0
  };
}

// Form validation wrapper component
interface FormValidationWrapperProps {
  children: React.ReactNode;
  errors: Record<string, string>;
  showSummary?: boolean;
  className?: string;
}

export function FormValidationWrapper({ 
  children, 
  errors, 
  showSummary = true,
  className = "" 
}: FormValidationWrapperProps) {
  const errorList = Object.values(errors).filter(Boolean);
  
  return (
    <div className={className}>
      {showSummary && errorList.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {errorList.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {children}
    </div>
  );
}

// Field error display component
interface FieldErrorProps {
  error?: string;
  touched?: boolean;
  className?: string;
}

export function FieldError({ error, touched, className = "" }: FieldErrorProps) {
  if (!error || !touched) return null;
  
  return (
    <div className={`flex items-center gap-1 text-red-600 text-sm mt-1 ${className}`}>
      <AlertTriangle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  );
}

// Success message component
interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function SuccessMessage({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: SuccessMessageProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <Alert className="border-green-200 bg-green-50 mb-4">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-green-600 hover:text-green-800 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Form submission with loading state
export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (
    onSubmit: () => Promise<void>,
    successMessage = "Form submitted successfully!",
    errorMessage = "An error occurred. Please try again."
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      await onSubmit();
      setSubmitSuccess(successMessage);
      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      setSubmitError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit,
    clearMessages: () => {
      setSubmitError(null);
      setSubmitSuccess(null);
    }
  };
}