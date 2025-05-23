import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";

class EventFeedbackForm extends HTMLElement {
  connectedCallback() {
    const raw = this.getAttribute("config") || "{}";
    const config = JSON.parse(decodeURIComponent(raw));
    const thumbsHeader = config.headerText?.thumbs || "How was this?";
    const textareaLabel =
      config.headerText?.textarea || "Please provide details: (optional)";

    this.attachShadow({ mode: "open" }).innerHTML = `
      <div style="margin-bottom: 1em;">
        <label>${thumbsHeader}</label><br/>
        <sl-icon-button name="hand-thumbs-up" label="Good"></sl-icon-button>
        <sl-icon-button name="hand-thumbs-down" label="Bad"></sl-icon-button>
      </div>
      <label>${textareaLabel}</label>
      <textarea rows="4" style="width: 100%;"></textarea>
    `;
  }
}

customElements.define("event-feedback-form", EventFeedbackForm);
