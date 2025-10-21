export interface BackendRegistrationHandlerProps {
  onComplete?: () => void;
  onError?: (error: string) => void;
}