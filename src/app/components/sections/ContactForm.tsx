'use client'
import React from "react";

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

  void isSubmitting;
  void submitStatus;
  void handleChange;

  return (
    <div>
      {/* Under Development Notice */}
      <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400 text-lg">⚠️</span>
          <div className="text-sm">
            <p className="text-yellow-400 font-semibold mb-2">Form Under Development</p>
            <p className="text-gray-300 mb-2">
              Currently building a notification service called{" "}
              <a
                href="https://github.com/kap-theorem/beacon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Beacon
              </a>
            </p>
            <p className="text-gray-400 text-xs">
              In the meantime, feel free to reach out via LinkedIn or GitHub!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 opacity-60 pointer-events-none">
        <div>
          <label className="block text-xs text-gray-500 mb-2">NAME</label>
          <input
            type="text"
            name="name"
            value="Working on it..."
            disabled
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2">EMAIL</label>
          <input
            type="email"
            name="email"
            value="notification@beacon.dev"
            disabled
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2">MESSAGE</label>
          <textarea
            name="message"
            value="Building Beacon - a notification service to power sms, email, and push notifications. Check out the progress on GitHub!"
            disabled
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-gray-500 text-sm cursor-not-allowed resize-none"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full bg-gray-700 text-gray-500 font-semibold py-3 px-6 rounded text-sm cursor-not-allowed"
        >
          COMING SOON
        </button>
      </form>
    </div>
  );
}
