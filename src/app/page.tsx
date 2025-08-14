'use client'
import React from 'react'

export default function Home() {
  const pictures = [
    "/images/linkedIn.jpg"
  ];

  const [currentPicIndex, setCurrentPicIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicIndex((prev) => (prev + 1) % pictures.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pictures.length]);

  // Experience data
  const experiences = [
    {
      period: "[Jan'2023 - Dec'2024]",
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
      period: "[Aug'2022 - Jan'2023]",
      company: "Mercedes-Benz Research & Development India",
      role: "Graduate Engineer Trainee - Over-the-Air(OTA) Updates Team",
      achievements: [
        "Built OTA updates data warehouse using Apache Spark on Databricks",
        "Developed multi-source data ingestion pipeline to Azure EventHubs",
        "Supported live OTA updates & eSIM management across global regions"
      ]
    },
    {
      period: "[Mar'2022 - Aug'2023]",
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
      features: ["Multi-calendar support", "Event conflict detection", "Timezone management"]
    },
    {
      name: "SEED Labs: Security Projects", 
      description: "Cybersecurity attacks and defenses implementation",
      tech: ["C", "Python", "Linux"],
      features: ["Buffer overflow", "SQL injection", "XSS attacks", "TCP attacks"]
    },
    {
      name: "Yet Another Centralized Scheduler",
      description: "Centralized scheduling framework similar to Hadoop YARN", 
      tech: ["Python", "Distributed Systems"],
      features: ["Resource management", "Job scheduling", "Cluster coordination"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono">
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Home Section */}
        <section id="home" className="mb-24">
          {/* Profile Info with Picture */}
          <div className="mb-12 flex gap-8 items-start">
            {/* Content - 60% */}
            <div className="flex-[60] space-y-4">
              <p className="text-2xl">
                <span className="text-cyan-400">[INFO]</span> Kushal Krishnappa
              </p>
              
              {/* Extended About Section */}
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="text-purple-400">[ABOUT]</span> Production Engineer with experience in building and scaling systems across enterprise environments. Currently pursuing Master&apos;s in Computer Science at Northeastern while bringing hands-on experience from managing critical infrastructure at Pure Storage and Mercedes-Benz.
                </p>
                <p className="text-lg">
                  Specialized in automation, system reliability, and large-scale deployments. Successfully reduced simulator recovery times from hours to minutes and managed 9,000+ production VMs with 99% automation. Passionate about solving complex infrastructure challenges, ML applications in DevSecOps and building invisible infrastructure.
                </p>
              </div>
            </div>

            {/* Picture Area - 40% */}
            <div className="flex-[40] flex justify-center">
              <div className="w-full h-96 border border-green-400 rounded overflow-hidden">
                <img 
                  src={pictures[currentPicIndex]} 
                  alt="Kushal Krishnappa" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextDiv = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextDiv) nextDiv.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-center text-green-400" style={{display: 'none'}}>
                  Image Loading...
                </div>
              </div>
            </div>
          </div>

          {/* Option 3: Card-style Status Layout */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-green-400 p-4 rounded text-center">
              <h3 className="text-cyan-400 text-sm font-bold mb-2">CURRENT ROLE</h3>
              <div className="text-sm">
                <div>MSCS Student</div>
                <div>@Northeastern University</div>
              </div>
            </div>
            <div className="border border-green-400 p-4 rounded text-center">
              <h3 className="text-blue-400 text-sm font-bold mb-2">LOCATION</h3>
              <div className="text-sm">
                <div>Boston, MA</div>
                <div>EST timezone</div>
              </div>
            </div>
            <div className="border border-green-400 p-4 rounded text-center">
              <h3 className="text-red-400 text-sm font-bold mb-2">EXPERIENCE</h3>
              <div className="text-sm">
                <div>2+ years across</div>
                <div>Production Systems</div>
              </div>
            </div>
          </div>

          {/* Social Communications Section */}
          <div className="border border-green-400 p-6 rounded">
            <h2 className="text-xl mb-4">$ ls -la /social/comms</h2>
            <div className="flex gap-6 justify-center">
              <a 
                href="https://linkedin.com/in/kushalkrishnappa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-blue-400 hover:text-cyan-400 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span>linkedin.com/in/kushalkrishnappa</span>
              </a>
              <a 
                href="https://github.com/kushalkrishnappa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-purple-400 hover:text-cyan-400 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <span>github.com/kushalkrishnappa</span>
              </a>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-24">
          <h1 className="text-4xl font-bold mb-8">$ cat /var/log/experience.log</h1>
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={index} className="border border-green-400 p-6 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl text-cyan-400">{experience.company}</h2>
                  <span className="text-xl text-cyan-400">{experience.period}</span>
                </div>
                <p className="text-yellow-400 mb-4">{experience.role}</p>
                <ul className="space-y-2 text-sm">
                  {experience.achievements.map((achievement, idx) => (
                    <li key={idx}>• {achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-24">
          <h1 className="text-4xl font-bold mb-8">$ cat /var/log/projects.log</h1>
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={index} className="border border-green-400 p-6 rounded">
                <h2 className="text-xl text-cyan-400 mb-2">{project.name}</h2>
                <p className="text-yellow-400 mb-4">{project.description}</p>
                <div className="mb-4">
                  <span className="text-white">Tech Stack: </span>
                  {project.tech.join(", ")}
                </div>
                <ul className="space-y-1 text-sm">
                  {project.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-24">
          <h1 className="text-4xl font-bold mb-8">$ cat /var/log/skills.log</h1>
          <div className="border border-green-400 p-6 rounded">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-cyan-400 mb-4">Languages</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Python</li>
                  <li>• Java</li>
                  <li>• C/C++</li>
                  <li>• JavaScript/TypeScript</li>
                  <li>• Go</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl text-cyan-400 mb-4">Technologies</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Flask, Django, FastAPI</li>
                  <li>• React, Next.js</li>
                  <li>• Docker, Kubernetes</li>
                  <li>• AWS, Azure</li>
                  <li>• Redis, RabbitMQ</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}