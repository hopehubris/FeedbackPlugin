export type FeedbackConfig = {
  type: "general" | "event-based";
  selectOptions?: string[]; // only for general
  headerText?: {
    select?: string;
    textarea?: string;
    thumbs?: string;
  };
};
