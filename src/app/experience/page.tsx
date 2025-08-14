export default function Experience() {
  // This is a JavaScript array of your work experience!
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
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono">
      <div className="container mx-auto px-4 py-16">
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
      </div>
    </div>
  )
}