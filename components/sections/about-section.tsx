"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { GraduationCap, MapPin, Download } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { skills, education, personalInfo } from "@/lib/constants"

export function AboutSection() {
  const scrollToExperience = () => {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate Computer Science & Engineering graduate with expertise in modern web technologies
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* About Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{education.degree}</h3>
                    <p className="text-muted-foreground">{education.university}</p>
                    <p className="text-sm text-muted-foreground">{education.period} • GPA: {education.gpa}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Relevant Coursework:</h4>
                    <div className="flex flex-wrap gap-2">
                      {education.relevantCourses.map((course) => (
                        <Badge key={course} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{personalInfo.location}</p>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button className="flex-1" asChild>
                  <a href={personalInfo.resume} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" onClick={scrollToExperience}>
                  View Experience
                </Button>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={itemVariants} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>
                    Technologies and tools I work with
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 capitalize">{category}</h4>
                      <div className="space-y-3">
                        {skillList.map((skill) => (
                          <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="bg-primary h-2 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Personal Statement */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card>
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-center max-w-4xl mx-auto">
                  &ldquo;I believe in the power of technology to solve real-world problems.
                  As a Computer Science &amp; Engineering graduate, I&apos;m passionate about
                  creating innovative solutions that make a difference. I specialize in
                  full-stack development with modern technologies like Next.js, React,
                  and Node.js, always striving to write clean, efficient, and maintainable code.&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
