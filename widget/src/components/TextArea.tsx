class FeedbackTextarea extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
        <textarea placeholder="Leave your feedback..." rows="4" style="width:100%;"></textarea>
      `;
  }
}

if (!customElements.get("feedback-textarea")) {
  customElements.define("feedback-textarea", FeedbackTextarea);
}
