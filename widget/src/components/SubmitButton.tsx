import "@shoelace-style/shoelace/dist/components/button/button.js";

class SubmitButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <sl-button variant="primary">Submit</sl-button>
    `;

    shadow.querySelector("sl-button")?.addEventListener("click", () => {
      const dialog =
        this.closest("feedback-widget")?.shadowRoot?.querySelector("sl-dialog");
      (dialog as any)?.hide();
    });
  }
}

if (!customElements.get("submit-button")) {
  customElements.define("submit-button", SubmitButton);
}
