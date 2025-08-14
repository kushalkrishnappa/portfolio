export default function Projects() {
  // This is a JavaScript array of your projects!
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
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono">
      <div className="container mx-auto px-4 py-16">
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
      </div>
    </div>
  )
}