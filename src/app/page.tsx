'use client'
import React from 'react'

export default function Home() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Experience data
  const experiences = [
    {
      period: "Jan'2023 - Dec'2024",
      company: "Pure Storage",
      role: "Member of Technical Staff 2",
      achievements: [
        "Reduced simulator recovery time: 5hr → 10min via Auto Sim Rehab",
        "Managed one-click updates across 9,000+ on-prem VMs",
        "99% manual intervention elimination through automation",
        "Migrated 1,500+ environments from Ubuntu 14 → 22",
        "Built distributed systems with Flask, RabbitMQ, Redis & Temporal",
        "Increased global infrastructure availability with 95%+ reliability"
      ]
    },
    {
      period: "Aug'2022 - Jan'2023",
      company: "Mercedes-Benz Research & Development India",
      role: "Graduate Engineer Trainee - Over-the-Air(OTA) Updates Team",
      achievements: [
        "Built OTA updates data warehouse using Apache Spark on Databricks",
        "Developed multi-source data ingestion pipeline to Azure EventHubs",
        "Supported live OTA updates & eSIM management across global regions"
      ]
    },
    {
      period: "Mar'2022 - Aug'2023",
      company: "Mercedes-Benz Research & Development India",
      role: "Software Intern - Over-the-Air(OTA) Updates Team",
      achievements: [
        "Built OTA updates analytics dashboard from scratch",
        "Automated deployment via Azure DevOps CI/CD pipelines",
        "Integrated OAuth2.0 for secure user authentication"
      ]
    }
  ];

  // Projects data
  const projects = [
    {
      name: "Virtual Calendar",
      description: "Full-stack virtual calendar application in Java",
      tech: ["Java", "Swing GUI", "MVC Architecture"],
      features: ["Multi-calendar support", "Event conflict detection", "Timezone management"],
      impact: "Streamlined event management with timezone-aware scheduling"
    },
    {
      name: "SEED Labs: Security Projects",
      description: "Cybersecurity attacks and defenses implementation",
      tech: ["C", "Python", "Linux"],
      features: ["Buffer overflow", "SQL injection", "XSS attacks", "TCP attacks"],
      impact: "Comprehensive security vulnerability analysis and mitigation"
    },
    {
      name: "Yet Another Centralized Scheduler",
      description: "Centralized scheduling framework similar to Hadoop YARN",
      tech: ["Python", "Distributed Systems"],
      features: ["Resource management", "Job scheduling", "Cluster coordination"],
      impact: "Efficient distributed resource allocation across cluster nodes"
    }
  ];

  const skills = [
    "Python", "Java", "C/C++", "JavaScript/TypeScript", "Go",
    "Flask", "Django", "FastAPI", "React", "Next.js",
    "Docker", "Kubernetes", "AWS", "Azure", "Redis", "RabbitMQ", "Temporal"
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">

        {/* Whoami Section */}
        <section id="home" className="mb-16 sm:mb-20">
          <div className="mb-8">
            <div className="text-green-400 mb-4">
              <span className="text-green-500">$</span> whoami
            </div>
            <div className="pl-4 border-l-2 border-gray-700">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Kushal Krishnappa
              </h1>
              <p className="text-xl sm:text-2xl text-cyan-400 mb-6">
                Production Engineer | Systems & Infrastructure Specialist
              </p>
              <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                <p>
                  Production Engineer with experience in building and scaling systems across
                  enterprise environments. Currently pursuing Master&apos;s in Computer Science at
                  Northeastern while bringing hands-on experience from managing critical infrastructure
                  at Pure Storage and Mercedes-Benz.
                </p>
                <p>
                  Specialized in automation, system reliability, and large-scale deployments.
                  Successfully reduced simulator recovery times from hours to minutes and managed
                  9,000+ production VMs with 99% automation. Passionate about solving complex
                  infrastructure challenges, ML applications in DevSecOps and building invisible infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-8">
            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
              <div className="text-gray-500 mb-1">ROLE</div>
              <div className="text-white">MSCS Student @ Northeastern</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
              <div className="text-gray-500 mb-1">LOCATION</div>
              <div className="text-white">Boston, MA</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
              <div className="text-gray-500 mb-1">EXPERIENCE</div>
              <div className="text-white">2+ years Production Systems</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16 sm:mb-20">
          <div className="text-green-400 mb-4">
            <span className="text-green-500">$</span> cat skills.txt
          </div>
          <div className="pl-4 border-l-2 border-gray-700">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-sm text-cyan-400 hover:border-cyan-600 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* System Architecture & Projects */}
        <section id="projects" className="mb-16 sm:mb-20">
          <div className="text-green-400 mb-4">
            <span className="text-green-500">$</span> ls -la ~/projects
          </div>
          <div className="pl-4 border-l-2 border-gray-700 space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">TECH STACK</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">KEY FEATURES</div>
                  <ul className="space-y-1 text-sm">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">▸</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">IMPACT</div>
                  <p className="text-sm text-gray-300">{project.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Achievements */}
        <section id="experience" className="mb-16 sm:mb-20">
          <div className="text-green-400 mb-4">
            <span className="text-green-500">$</span> cat experience.log
          </div>
          <div className="pl-4 border-l-2 border-gray-700 space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded hover:border-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{exp.company}</h3>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{exp.period}</span>
                </div>
                <p className="text-cyan-400 mb-4 text-sm sm:text-base">{exp.role}</p>

                <div className="space-y-2">
                  {exp.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <span className="text-green-500 mr-2 mt-1">▸</span>
                      <span className="text-gray-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact & Achievements Summary */}
        <section id="impact" className="mb-16 sm:mb-20">
          <div className="text-green-400 mb-4">
            <span className="text-green-500">$</span> ./impact_metrics.sh
          </div>
          <div className="pl-4 border-l-2 border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-5 rounded">
                <div className="text-2xl font-bold text-green-400 mb-2">5hr → 10min</div>
                <div className="text-xs text-gray-400">SIMULATOR RECOVERY TIME</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded">
                <div className="text-2xl font-bold text-green-400 mb-2">9,000+</div>
                <div className="text-xs text-gray-400">VMS MANAGED</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-5 rounded">
                <div className="text-2xl font-bold text-green-400 mb-2">99%</div>
                <div className="text-xs text-gray-400">AUTOMATION RATE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-8">
          <div className="text-green-400 mb-4">
            <span className="text-green-500">$</span> contact --send-message
          </div>
          <div className="pl-4 border-l-2 border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2">LOCATION</div>
                  <div className="text-white">Boston, MA</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-3">SOCIAL LINKS</div>
                  <div className="space-y-3">
                    <a
                      href="https://linkedin.com/in/kushalkrishnappa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-colors group"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-sm group-hover:underline">linkedin.com/in/kushalkrishnappa</span>
                    </a>

                    <a
                      href="https://github.com/kushalkrishnappa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-colors group"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-sm group-hover:underline">github.com/kushalkrishnappa</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                {/* Under Development Notice */}
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-400 text-lg">⚠️</span>
                    <div className="text-sm">
                      <p className="text-yellow-400 font-semibold mb-2">Form Under Development</p>
                      <p className="text-gray-300 mb-2">
                        Currently building the backend notification service using{' '}
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
                        In the meantime, feel free to reach out via LinkedIn or GitHub above!
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
                      value="Building Beacon - a notification service to power this contact form. Check out the progress on GitHub!"
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
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
          <p>© 2025 Kushal Krishnappa. Built with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
