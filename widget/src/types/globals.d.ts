export {};

declare global {
  interface Window {
    FeedbackWidget: {
      open: (config: FeedbackConfig) => void;
    };
  }
}
