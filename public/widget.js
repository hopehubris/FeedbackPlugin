(function () {
  let appId = null;
  let widgetContainer = null;

  function createWidget() {
    const container = document.createElement("div");
    container.id = "feedback-loop-widget-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";

    const button = document.createElement("button");
    button.textContent = "Feedback";
    button.style.backgroundColor = "#0ea5e9";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "9999px";
    button.style.padding = "12px 24px";
    button.style.fontSize = "16px";
    button.style.fontWeight = "600";
    button.style.cursor = "pointer";
    button.style.boxShadow =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";

    button.addEventListener("click", () => {
      const modal = createModal();
      document.body.appendChild(modal);
    });

    container.appendChild(button);
    return container;
  }

  function createModal() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "10000";

    const modal = document.createElement("div");
    modal.style.backgroundColor = "white";
    modal.style.borderRadius = "8px";
    modal.style.padding = "24px";
    modal.style.width = "400px";
    modal.style.maxWidth = "90vw";

    const header = document.createElement("div");
    header.style.marginBottom = "16px";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const title = document.createElement("h2");
    title.textContent = "Share Your Feedback";
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.fontWeight = "600";

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "0";
    closeButton.style.lineHeight = "1";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    modal.appendChild(header);

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "16px";

    const ratingContainer = document.createElement("div");
    ratingContainer.style.display = "flex";
    ratingContainer.style.gap = "8px";
    ratingContainer.style.justifyContent = "center";
    ratingContainer.style.marginBottom = "16px";

    let selectedRating = 0;
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = "★";
      star.style.fontSize = "24px";
      star.style.cursor = "pointer";
      star.style.color = "#e2e8f0";
      star.addEventListener("click", () => {
        selectedRating = i;
        ratingContainer.querySelectorAll("span").forEach((s, index) => {
          s.style.color = index < i ? "#0ea5e9" : "#e2e8f0";
        });
      });
      ratingContainer.appendChild(star);
    }

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Tell us more about your experience (optional)";
    commentInput.style.width = "100%";
    commentInput.style.padding = "8px";
    commentInput.style.border = "1px solid #e2e8f0";
    commentInput.style.borderRadius = "4px";
    commentInput.style.minHeight = "100px";
    commentInput.style.resize = "vertical";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Your email (optional)";
    emailInput.style.width = "100%";
    emailInput.style.padding = "8px";
    emailInput.style.border = "1px solid #e2e8f0";
    emailInput.style.borderRadius = "4px";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Feedback";
    submitButton.style.backgroundColor = "#0ea5e9";
    submitButton.style.color = "white";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "4px";
    submitButton.style.padding = "8px 16px";
    submitButton.style.fontWeight = "600";
    submitButton.style.cursor = "pointer";

    form.appendChild(ratingContainer);
    form.appendChild(commentInput);
    form.appendChild(emailInput);
    form.appendChild(submitButton);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (selectedRating === 0) {
        alert("Please select a rating before submitting.");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appId,
            pageUrl: window.location.href,
            rating: selectedRating,
            comment: commentInput.value,
            email: emailInput.value || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }

        alert("Thank you for your feedback!");
        document.body.removeChild(overlay);
      } catch (error) {
        alert("Failed to submit feedback. Please try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Feedback";
      }
    });

    modal.appendChild(form);
    overlay.appendChild(modal);
    return overlay;
  }

  function init(config) {
    if (!config.appId) {
      console.error("FeedbackLoop: appId is required");
      return;
    }

    appId = config.appId;
    widgetContainer = createWidget();
    document.body.appendChild(widgetContainer);
  }

  window.feedbackLoop = function () {
    const args = Array.from(arguments);
    const command = args[0];
    const config = args[1];

    if (command === "init") {
      init(config);
    }
  };
})();
