export const personalInfo = {
  name: "Nazrawi Solomon Abera",
  title: "Computer Science & Engineering Graduate",
  email: "snazrawi@gmail.com",
  phone: "+251911852563",
  location: "Addis Ababa, Ethiopia",
  linkedin: "https://www.linkedin.com/in/nazrawi-solomon/",
  github: "https://github.com/naz12",
  resume: "/resume.pdf",
  profileImage: "/profile.JPG",
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

export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl: string
  demoUrl?: string
  category: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Akili",
    description: "An intelligent application showcasing modern web development practices with advanced features and user-friendly interface.",
    image: "/projects/akili.jpg",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/naz12/Akili",
    category: "Web Application"
  },
  {
    id: 2,
    title: "Zoys",
    description: "A dynamic web application demonstrating full-stack development capabilities with modern technologies and responsive design.",
    image: "/projects/zoys.jpg",
    technologies: ["React", "Node.js", "Express.js", "JavaScript"],
    githubUrl: "https://github.com/naz12/Zoys",
    category: "Full Stack"
  },
  {
    id: 3,
    title: "Streaming Service Platform",
    description: "A comprehensive streaming service platform with web client and mobile app integration, featuring real-time streaming capabilities.",
    image: "/projects/streaming.jpg",
    technologies: ["Next.js", "TypeScript", "Kotlin", "Android"],
    githubUrl: "https://github.com/naz12/Streaming-Service-Project",
    category: "Full Stack"
  },
  {
    id: 4,
    title: "PrimeAndroid",
    description: "Android application for PrimeTube with modern UI/UX design and optimized performance for mobile streaming.",
    image: "/projects/primeandroid.jpg",
    technologies: ["Kotlin", "Android", "Mobile Development"],
    githubUrl: "https://github.com/naz12/PrimeAndroid",
    category: "Mobile Development"
  }
]

export const experience = [
  {
    title: "Senior Full-Stack Developer",
    company: "ET Systems",
    period: "January 2024 - January 2026",
    description:
      "Senior developer on diverse client projects, responsible for end-to-end delivery from frontend and backend development through deployment.",
    achievements: [
      "Led full-stack development across multiple client projects",
      "Built and shipped applications with React, Next.js, Node.js, PHP, and Laravel",
      "Owned deployment and production delivery for client solutions"
    ]
  },
  {
    title: "Full Stack Developer",
    company: "Guzo",
    period: "April 2021 - November 2023",
    description:
      "Full-stack developer with a strong frontend focus, building user-facing applications with React, UI/UX design principles, and Node.js backends.",
    achievements: [
      "Developed responsive web applications with React",
      "Collaborated on UI/UX design and implementation",
      "Built and maintained Node.js API integrations and backend services"
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
