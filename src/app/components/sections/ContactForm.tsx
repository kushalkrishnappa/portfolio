'use client'
import React from "react";

const FIELD_CLASS =
  "w-full rounded-md border bg-[color:var(--bg)] border-[color:var(--line-2)] px-4 py-2 text-sm text-[color:var(--bone)] placeholder:text-[color:var(--faint)] transition-colors focus:outline-none focus:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] disabled:cursor-not-allowed disabled:text-[color:var(--faint)]";

const LABEL_CLASS =
  "mono mb-2 block text-[11px] uppercase tracking-[0.14em] text-[color:var(--dim)]";

export default function ContactForm() {
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

  // Bound to inputs for when the form is re-enabled (inputs are disabled for now).
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // The form is intentionally disabled while Beacon is in development. The state
  // and handlers above are kept so re-enabling is a one-line change; these voids
  // mark them as deliberately-unused for now.
  void isSubmitting;
  void submitStatus;
  void handleChange;

  return (
    <div>
      {/* Under-development notice. */}
      <div
        className="mb-4 rounded-lg border p-4"
        style={{ background: "var(--surface)", borderColor: "var(--line-2)" }}
      >
        <p
          className="mono mb-2 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          Form under development
        </p>
        <p className="text-sm" style={{ color: "var(--dim)" }}>
          Currently building a notification service called{" "}
          <a
            href="https://github.com/kap-theorem/beacon"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline transition-opacity hover:opacity-80 text-[color:var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded-sm"
          >
            Beacon
          </a>
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--faint)" }}>
          In the meantime, feel free to reach out via LinkedIn or GitHub!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 opacity-60 pointer-events-none">
        <div>
          <label className={LABEL_CLASS}>Name</label>
          <input
            type="text"
            name="name"
            value="Working on it..."
            disabled
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Email</label>
          <input
            type="email"
            name="email"
            value="notification@beacon.dev"
            disabled
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Message</label>
          <textarea
            name="message"
            value="Building Beacon - a notification service to power sms, email, and push notifications. Check out the progress on GitHub!"
            disabled
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>

        <button
          type="button"
          disabled
          className="mono w-full rounded-md border py-3 px-6 text-xs uppercase tracking-[0.14em] cursor-not-allowed"
          style={{ borderColor: "var(--line-2)", color: "var(--dim)" }}
        >
          Coming soon
        </button>
      </form>
    </div>
  );
}
