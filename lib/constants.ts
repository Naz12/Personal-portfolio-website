export const personalInfo = {
  name: "Nazrawi Solomon Abera",
  title: "Computer Science & Engineering Graduate",
  email: "snazrawi@gmail.com",
  phone: "+251911852563",
  location: "Addis Ababa, Ethiopia",
  linkedin: "https://www.linkedin.com/in/nazrawi-solomon/",
  github: "https://github.com/naz12",
  resume: "/resume.pdf"
}

export const skills = {
  frontend: [
    { name: "Next.js", level: 90 },
    { name: "React", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "JavaScript", level: 95 }
  ],
  backend: [
    { name: "Node.js", level: 85 },
    { name: "Express.js", level: 80 },
    { name: "REST APIs", level: 85 },
    { name: "MongoDB", level: 75 },
    { name: "PostgreSQL", level: 70 }
  ],
  mobile: [
    { name: "Kotlin", level: 80 },
    { name: "Android Development", level: 75 },
    { name: "Mobile UI/UX", level: 70 }
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "VS Code", level: 95 },
    { name: "Figma", level: 70 },
    { name: "Docker", level: 60 },
    { name: "AWS", level: 50 }
  ]
}

export const projects = [
  {
    id: 1,
    title: "Akili",
    description: "An intelligent application showcasing modern web development practices with advanced features and user-friendly interface.",
    image: "/projects/akili.jpg",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://github.com/naz12/Akili",
    githubUrl: "https://github.com/naz12/Akili",
    category: "Web Application"
  },
  {
    id: 2,
    title: "Zoys",
    description: "A dynamic web application demonstrating full-stack development capabilities with modern technologies and responsive design.",
    image: "/projects/zoys.jpg",
    technologies: ["React", "Node.js", "Express.js", "JavaScript"],
    liveUrl: "https://github.com/naz12/Zoys",
    githubUrl: "https://github.com/naz12/Zoys",
    category: "Full Stack"
  },
  {
    id: 3,
    title: "Streaming Service Platform",
    description: "A comprehensive streaming service platform with web client and mobile app integration, featuring real-time streaming capabilities.",
    image: "/projects/streaming.jpg",
    technologies: ["Next.js", "TypeScript", "Kotlin", "Android"],
    liveUrl: "https://github.com/naz12/Streaming-Service-Project",
    githubUrl: "https://github.com/naz12/Streaming-Service-Project",
    category: "Full Stack"
  },
  {
    id: 4,
    title: "PrimeAndroid",
    description: "Android application for PrimeTube with modern UI/UX design and optimized performance for mobile streaming.",
    image: "/projects/primeandroid.jpg",
    technologies: ["Kotlin", "Android", "Mobile Development"],
    liveUrl: "https://github.com/naz12/PrimeAndroid",
    githubUrl: "https://github.com/naz12/PrimeAndroid",
    category: "Mobile Development"
  }
]

export const experience = [
  {
    title: "Frontend Developer Intern",
    company: "Tech Solutions Inc.",
    period: "2023 - Present",
    description: "Developed responsive web applications using React and Next.js. Collaborated with design team to implement UI/UX designs.",
    achievements: [
      "Improved application performance by 40%",
      "Implemented automated testing pipeline",
      "Mentored junior developers"
    ]
  },
  {
    title: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2022 - 2023",
    description: "Built custom web solutions for small businesses including e-commerce sites, portfolios, and business websites.",
    achievements: [
      "Delivered 15+ successful projects",
      "Achieved 100% client satisfaction rate",
      "Specialized in React and Node.js development"
    ]
  }
]

export const education = {
  degree: "Bachelor of Science in Computer Science & Engineering",
  university: "Adama Science and Technology University",
  period: "2015 - 2021",
  gpa: "3.18/4.0",
  relevantCourses: [
    "Data Structures and Algorithms",
    "Software Engineering",
    "Database Systems",
    "Web Development",
    "Computer Networks",
    "Machine Learning"
  ]
}
