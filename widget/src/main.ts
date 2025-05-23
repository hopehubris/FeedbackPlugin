import { defineFeedbackWidget } from "./components/FeedbackDialog";
import type { FeedbackConfig } from "./types/FeedbackConfig";

defineFeedbackWidget();

window.FeedbackWidget = {
  open: (config: FeedbackConfig) => {
    let el = document.querySelector("feedback-widget") as any;
    if (!el) {
      el = document.createElement("feedback-widget");
      document.body.appendChild(el);
    }
    el.setConfig(config);
    el.open();
  },
};
