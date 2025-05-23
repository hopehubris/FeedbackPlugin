class GeneralFeedbackForm extends HTMLElement {
  connectedCallback() {
    const raw = this.getAttribute("config") || "{}";
    const config = JSON.parse(decodeURIComponent(raw));
    const options = config.selectOptions || [
      "UI Bug",
      "Usability",
      "Accessibility",
      "Something else",
    ];
    const headerText =
      config.headerText?.select ||
      "What type of issue do you wish to report? (optional)";
    const textareaLabel =
      config.headerText?.textarea || "Please provide details: (optional)";

    const selectHTML = `
        <label>${headerText}</label>
        <select style="width: 100%; margin-bottom: 1em;">
          ${options.map((o: string) => `<option>${o}</option>`).join("")}
        </select>
      `;

    const textareaHTML = `
        <label>${textareaLabel}</label>
        <textarea rows="4" style="width: 100%;"></textarea>
      `;

    this.attachShadow({ mode: "open" }).innerHTML = `
        ${selectHTML}
        ${textareaHTML}
      `;
  }
}

customElements.define("general-feedback-form", GeneralFeedbackForm);
