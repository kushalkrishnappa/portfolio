'use client'
import React from "react";

/**
 * ContactForm — sheet 10's "Request for information" transmittal.
 *
 * Posts { name, email, message } to /api/contact (nodemailer); the route
 * validates that all three fields are present. The inputs are `required`
 * (email `type="email"`) so the browser checks them before sending.
 * Styled by field-manual.css (`.rfi*`).
 */
export default function ContactForm({ className }: { className?: string }) {
  const uid = React.useId();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const statusClass =
    submitStatus.type === "success" ? "rfi-status ok" : submitStatus.type === "error" ? "rfi-status err" : "rfi-status";

  return (
    <form
      className={["rfi", className].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
      aria-labelledby={`${uid}-cap`}
    >
      <p className="rfi-cap" id={`${uid}-cap`}>
        <span>Schedule L — Request for information</span>
        <b aria-hidden="true">RFI · 10</b>
      </p>
      <div className="rfi-grid">
        <div className="rfi-f">
          <label htmlFor={`${uid}-name`}>From · name</label>
          <input
            id={`${uid}-name`}
            type="text"
            name="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="rfi-f">
          <label htmlFor={`${uid}-email`}>Reply to · email</label>
          <input
            id={`${uid}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="rfi-f full">
          <label htmlFor={`${uid}-message`}>Request</label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={3}
            required
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="rfi-foot">
        <button type="submit" className="rfi-send" disabled={isSubmitting}>
          {isSubmitting ? "Transmitting…" : "Transmit RFI"}
          <span className="arr" aria-hidden="true">→</span>
        </button>
        <p className={statusClass} role="status" aria-live="polite">
          {submitStatus.message || "Routed to K. Krishnappa by email."}
        </p>
      </div>
    </form>
  );
}
