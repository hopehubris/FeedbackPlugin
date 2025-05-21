import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

declare global {
  interface Window {
    FeedbackWidget: {
      open: () => void;
    };
  }
}

class FeedbackWidget extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/light.css">
      <sl-dialog label="Feedback" class="feedback-dialog">
        <textarea placeholder="Leave your feedback..." rows="4" style="width:100%;"></textarea>
        <sl-button slot="footer" variant="primary">Submit</sl-button>
      </sl-dialog>
    `;
  }

  open() {
    const dialog = this.shadowRoot?.querySelector("sl-dialog");
    (dialog as any).show();
  }
}

customElements.define("feedback-widget", FeedbackWidget);

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
