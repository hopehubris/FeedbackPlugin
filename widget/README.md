# Feedback Widget

A framework-agnostic, embeddable feedback widget built with TypeScript, Vite, and Shoelace.  
This widget can be used across apps via a single `<script>` tag and provides a global API to trigger the feedback modal programmatically.

---

## 📁 Project Structure

This widget lives in the `/feedback-widget` directory inside your main project.

The build output is written to `/public/widget/widget.js` of your main app (Next.js or Remix), making it available at:  
`http://localhost:3000/widget/widget.js`

---

## 🚀 Getting Started

### 1. Install & Build

```bash
cd feedback-widget
npm install
npm run build
```

### 2. Run your main app

```bash
cd ..
npm run dev
```

Your app can now embed the widget using following path:
http://localhost:3000/widget/widget.js

## Embed in any App

```bash
<script
  src="http://localhost:3000/widget/widget.js"
  data-app-id="your-app-id"
  defer
></script>
```

## Trigger the Widget

Add this TypeScript declaration to your app:

```bash
declare global {
  interface Window {
    FeedbackWidget: {
      open: () => void;
    };
  }
}
```

### Open widget programmatically:

```bash
window?.FeedbackWidget?.open();

```
