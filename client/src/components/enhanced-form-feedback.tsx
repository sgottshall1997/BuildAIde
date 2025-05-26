import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react";

// Enhanced error message component for form fields
interface FieldErrorMessageProps {
  error?: string;
  touched?: boolean;
  fieldName?: string;
}

export function FieldErrorMessage({ error, touched, fieldName }: FieldErrorMessageProps) {
  if (!error || !touched) return null;

  return (
    <div className="flex items-center gap-2 mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
      <XCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

// Success feedback for valid fields
interface FieldSuccessMessageProps {
  isValid?: boolean;
  message?: string;
}

export function FieldSuccessMessage({ isValid, message = "Valid input" }: FieldSuccessMessageProps) {
  if (!isValid) return null;

  return (
    <div className="flex items-center gap-2 mt-1 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// Form submission error alert
interface FormSubmissionErrorProps {
  error?: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function FormSubmissionError({ error, onRetry, onDismiss }: FormSubmissionErrorProps) {
  if (!error) return null;

  return (
    <Alert className="border-red-200 bg-red-50 mb-4">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <div className="flex flex-col gap-3">
          <p className="text-red-800 font-medium">Submission Failed</p>
          <p className="text-red-700">{error}</p>
          <div className="flex gap-2">
            {onRetry && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onDismiss}
                className="text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Results generation failure fallback
interface ResultsFailureFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export function ResultsFailureFallback({ 
  title = "Unable to Generate Results",
  message = "We encountered an issue processing your request. Please check your inputs and try again.",
  onRetry,
  onReset
}: ResultsFailureFallbackProps) {
  return (
    <div className="text-center py-8">
      <Alert className="border-orange-200 bg-orange-50 max-w-lg mx-auto">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <AlertDescription>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">{title}</h3>
              <p className="text-orange-800">{message}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onReset && (
                <Button 
                  variant="outline" 
                  onClick={onReset}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Reset Form
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Form validation summary
interface FormValidationSummaryProps {
  errors: { [key: string]: string };
  isVisible?: boolean;
}

export function FormValidationSummary({ errors, isVisible = true }: FormValidationSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([_, error]) => error && error.length > 0);
  
  if (errorEntries.length === 0 || !isVisible) return null;

  return (
    <Alert className="border-red-200 bg-red-50 mb-4">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold text-red-900">
            Please fix {errorEntries.length} error{errorEntries.length > 1 ? 's' : ''} before submitting:
          </p>
          <ul className="text-red-800 space-y-1">
            {errorEntries.map(([field, error]) => (
              <li key={field} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></span>
                <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}: {error}</span>
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Success feedback for successful submissions
interface SubmissionSuccessProps {
  message?: string;
  onDismiss?: () => void;
}

export function SubmissionSuccess({ 
  message = "Your request has been processed successfully!",
  onDismiss 
}: SubmissionSuccessProps) {
  return (
    <Alert className="border-green-200 bg-green-50 mb-4">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <p className="text-green-800 font-medium">{message}</p>
          {onDismiss && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onDismiss}
              className="text-green-600 hover:text-green-800"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Loading state with contextual message
interface FormLoadingStateProps {
  message?: string;
  isLoading?: boolean;
}

export function FormLoadingState({ 
  message = "Processing your request...",
  isLoading = false 
}: FormLoadingStateProps) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-4 text-blue-600">
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span className="font-medium">{message}</span>
    </div>
  );
}