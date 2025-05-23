import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "./Modules/General";
import "./Modules/EventBased";
import type { FeedbackConfig } from "../types/FeedbackConfig";

export function defineFeedbackWidget() {
  class FeedbackWidget extends HTMLElement {
    private config: FeedbackConfig | null = null;
    shadow = this.attachShadow({ mode: "open" });

    setConfig(config: FeedbackConfig) {
      this.config = config;
      this.render();
    }

    open() {
      const dialog = this.shadowRoot?.querySelector("sl-dialog");
      (dialog as any)?.show();
    }

    render() {
      const content = this.getContent();
      this.shadow.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/cdn/themes/light.css">
        <sl-dialog label="Feedback">
          ${content}
        </sl-dialog>
      `;
    }

    getContent(): string {
      if (!this.config) return "";

      const configStr = encodeURIComponent(JSON.stringify(this.config));

      switch (this.config.type) {
        case "general":
          return `<general-feedback-form config="${configStr}"></general-feedback-form>`;
        case "event-based":
          return `<event-feedback-form config="${configStr}"></event-feedback-form>`;
        default:
          return `<p>Unsupported feedback type</p>`;
      }
    }
  }

  if (!customElements.get("feedback-widget")) {
    customElements.define("feedback-widget", FeedbackWidget);
  }
}
