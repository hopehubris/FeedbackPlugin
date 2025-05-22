import { defineFeedbackWidget } from "./components/FeedbackDialog";

defineFeedbackWidget();

window.FeedbackWidget = {
  open: () => {
    let el = document.querySelector("feedback-widget") as any;
    if (!el) {
      el = document.createElement("feedback-widget");
      document.body.appendChild(el);
    }
    el.open();
  },
};
