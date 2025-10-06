export const personalInfo = {
  name: "Nazrawi Solomon Abera",
  title: "Computer Science & Engineering Graduate",
  email: "nazrawi@example.com",
  location: "Addis Ababa, Ethiopia",
  linkedin: "https://linkedin.com/in/nazrawi-solomon",
  github: "https://github.com/nazrawi-solomon",
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
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform built with Next.js, featuring user authentication, payment integration, and admin dashboard.",
    image: "/projects/ecommerce.jpg",
    technologies: ["Next.js", "React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://ecommerce-demo.com",
    githubUrl: "https://github.com/nazrawi-solomon/ecommerce",
    category: "Full Stack"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "/projects/taskmanager.jpg",
    technologies: ["React", "Express.js", "Socket.io", "PostgreSQL"],
    liveUrl: "https://taskmanager-demo.com",
    githubUrl: "https://github.com/nazrawi-solomon/taskmanager",
    category: "Web App"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "/projects/weather.jpg",
    technologies: ["Next.js", "TypeScript", "OpenWeather API", "Chart.js"],
    liveUrl: "https://weather-demo.com",
    githubUrl: "https://github.com/nazrawi-solomon/weather",
    category: "Frontend"
  },
  {
    id: 4,
    title: "Blog Platform",
    description: "A modern blog platform with markdown support, SEO optimization, and content management system.",
    image: "/projects/blog.jpg",
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    liveUrl: "https://blog-demo.com",
    githubUrl: "https://github.com/nazrawi-solomon/blog",
    category: "Frontend"
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
  university: "Addis Ababa University",
  period: "2019 - 2023",
  gpa: "3.8/4.0",
  relevantCourses: [
    "Data Structures and Algorithms",
    "Software Engineering",
    "Database Systems",
    "Web Development",
    "Computer Networks",
    "Machine Learning"
  ]
}
