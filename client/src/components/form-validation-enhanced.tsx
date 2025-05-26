import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

// Enhanced validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormState {
  values: { [key: string]: any };
  errors: FormErrors;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

// Enhanced validation hook
export function useFormValidation(
  initialValues: { [key: string]: any },
  validationRules: FieldValidation
) {
  const [formState, setFormState] = useState<FormState>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitError: null,
    submitSuccess: false
  });

  const validateField = (name: string, value: any): string | null => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') return null;

    // String length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters`;
      }
    }

    // Numeric validations
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);
      if (rule.min !== undefined && numValue < rule.min) {
        return `Must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && numValue > rule.max) {
        return `Must be no more than ${rule.max}`;
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return `Invalid format`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formState.values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setFormState(prev => ({ ...prev, errors: newErrors }));
    return isValid;
  };

  const updateField = (name: string, value: any) => {
    const error = validateField(name, value);
    
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: error || '' },
      submitError: null // Clear submit error when user makes changes
    }));
  };

  const touchField = (name: string) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true }
    }));
  };

  const setSubmitting = (isSubmitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting }));
  };

  const setSubmitError = (error: string | null) => {
    setFormState(prev => ({ ...prev, submitError: error, submitSuccess: false }));
  };

  const setSubmitSuccess = () => {
    setFormState(prev => ({ 
      ...prev, 
      submitError: null, 
      submitSuccess: true,
      isSubmitting: false 
    }));
  };

  const resetForm = () => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      submitError: null,
      submitSuccess: false
    });
  };

  const isFieldValid = (name: string): boolean => {
    return !formState.errors[name] && formState.touched[name];
  };

  const hasErrors = (): boolean => {
    return Object.values(formState.errors).some(error => error && error.length > 0);
  };

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    submitError: formState.submitError,
    submitSuccess: formState.submitSuccess,
    updateField,
    touchField,
    validateAllFields,
    setSubmitting,
    setSubmitError,
    setSubmitSuccess,
    resetForm,
    isFieldValid,
    hasErrors
  };
}

// Enhanced field error component
interface FieldErrorProps {
  error?: string;
  touched?: boolean;
  className?: string;
}

export function FieldError({ error, touched, className = "" }: FieldErrorProps) {
  if (!error || !touched) return null;

  return (
    <div className={`flex items-center gap-1 mt-1 text-sm text-red-600 ${className}`}>
      <XCircle className="w-3 h-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

// Field success indicator
interface FieldSuccessProps {
  isValid?: boolean;
  className?: string;
}

export function FieldSuccess({ isValid, className = "" }: FieldSuccessProps) {
  if (!isValid) return null;

  return (
    <div className={`flex items-center gap-1 mt-1 text-sm text-green-600 ${className}`}>
      <CheckCircle className="w-3 h-3 flex-shrink-0" />
      <span>Valid</span>
    </div>
  );
}

// Form submit error alert
interface FormSubmitErrorProps {
  error?: string | null;
  onDismiss?: () => void;
}

export function FormSubmitError({ error, onDismiss }: FormSubmitErrorProps) {
  if (!error) return null;

  return (
    <Alert className="border-red-200 bg-red-50 mb-4">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex items-center justify-between">
          <span>{error}</span>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Form submit success alert
interface FormSubmitSuccessProps {
  message?: string;
  onDismiss?: () => void;
}

export function FormSubmitSuccess({ message = "Success!", onDismiss }: FormSubmitSuccessProps) {
  return (
    <Alert className="border-green-200 bg-green-50 mb-4">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center justify-between">
          <span>{message}</span>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Results fallback component
interface ResultsFallbackProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export function ResultsFallback({ 
  error = "Unable to generate results. Please try again.", 
  onRetry, 
  className = "" 
}: ResultsFallbackProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <Alert className="border-orange-200 bg-orange-50 max-w-md mx-auto">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-3">
            <p>{error}</p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="text-orange-700 hover:text-orange-900 font-medium underline"
              >
                Try Again
              </button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Form validation wrapper component
interface FormValidationWrapperProps {
  children: React.ReactNode;
  errors: FormErrors;
  submitError?: string | null;
  submitSuccess?: boolean;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
  className?: string;
}

export function FormValidationWrapper({
  children,
  errors,
  submitError,
  submitSuccess,
  onDismissError,
  onDismissSuccess,
  className = ""
}: FormValidationWrapperProps) {
  const errorCount = Object.values(errors).filter(error => error && error.length > 0).length;

  return (
    <div className={className}>
      {/* Form-level error summary */}
      {errorCount > 0 && (
        <Alert className="border-red-200 bg-red-50 mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>
                Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting
              </span>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                {errorCount}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit error */}
      <FormSubmitError error={submitError} onDismiss={onDismissError} />

      {/* Submit success */}
      {submitSuccess && (
        <FormSubmitSuccess 
          message="Form submitted successfully!" 
          onDismiss={onDismissSuccess} 
        />
      )}

      {children}
    </div>
  );
}