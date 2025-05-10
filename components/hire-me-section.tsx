"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Send, ExternalLink, MessageSquare, Calendar, Clock, DollarSign, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const contactPlatforms = [
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-6 w-6 text-[#EA4335]" />,
    color: "#EA4335",
    link: "mailto:anantasharma510@gmail.com",
    username: "anantasharma510@gmail.com",
    description: "Direct email communication for project inquiries and collaborations.",
    benefits: ["Detailed project discussions", "File attachments", "Professional communication"],
    cta: "Send Email",
  },
  {
    id: "fiverr",
    name: "Fiverr",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#1DBF73" className="h-6 w-6">
        <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.594.382.992 1.181.992.496 0 .988-.2 1.358-.496l.625.779c-.547.458-1.16.73-2.015.73-1.61 0-2.618-.917-2.618-2.466 0-1.533.99-2.466 2.442-2.466 1.358 0 2.397.777 2.397 2.35a3.08 3.08 0 0 1-.01.577zm-1.587-1.316c-.078-.586-.43-.938-1.142-.938-.625 0-1.045.352-1.123.938h2.265zm-5.716 3.558h-1.609v-3.558h-.43c-.537 0-.957.4-.957.917a.73.73 0 0 0 .039.235h-.04v2.406H3.7v-3.558h-.43c-.536 0-.956.4-.956.917a.73.73 0 0 0 .039.235h-.04v2.406H.704v-4.874h1.61v.74c.263-.574.624-.74 1.161-.74h.488v.74c.264-.574.625-.74 1.162-.74h.43v.74c.264-.574.635-.74 1.172-.74h.741v5.614zm21.996-5.596c0 .322-.261.583-.582.583a.583.583 0 0 1-.583-.583c0-.321.261-.582.583-.582.32 0 .582.261.582.582z" />
      </svg>
    ),
    color: "#1DBF73",
    link: "https://www.fiverr.com/sellers/anantasharma10",
    username: "anantasharma10",
    description: "Hire me for specific gigs and services with secure payment protection.",
    benefits: ["Secure payments", "Clear deliverables", "Review system"],
    cta: "View Fiverr Profile",
  },
  {
    id: "upwork",
    name: "Upwork",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#6FDA44" className="h-6 w-6">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06a2.705 2.705 0 012.703 2.703 2.707 2.707 0 01-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112a2.551 2.551 0 01-2.547 2.548 2.55 2.55 0 01-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
    color: "#6FDA44",
    link: "https://www.upwork.com/freelancers/~01d2d1c7562375d532",
    username: "Ananta Sharma",
    description: "Hire me for hourly or fixed-price projects with milestone-based payments.",
    benefits: ["Hourly or fixed-price", "Milestone payments", "Work history & reviews"],
    cta: "View Upwork Profile",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" className="h-6 w-6">
        <defs>
          <radialGradient id="instaGradient" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <path
          fill="url(#instaGradient)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
    color: "#E1306C",
    link: "https://www.instagram.com/samir__sharma10/",
    username: "samir__sharma10",
    description: "Connect with me on Instagram for casual inquiries and visual updates on my work.",
    benefits: ["Visual portfolio", "Direct messaging", "Quick responses"],
    cta: "Message on Instagram",
  },
]

const services = [
  {
    title: "Web Development",
    description: "Full-stack web applications with modern technologies",
    icon: <Code className="h-6 w-6 text-primary" />,
    price: "Starting at $500",
    deliveryTime: "2-4 weeks",
  },
  {
    title: "UI/UX Design",
    description: "User-centered design with intuitive interfaces",
    icon: <Palette className="h-6 w-6 text-primary" />,
    price: "Starting at $300",
    deliveryTime: "1-2 weeks",
  },
  {
    title: "E-commerce Solutions",
    description: "Custom online stores with payment integration",
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    price: "Starting at $800",
    deliveryTime: "3-6 weeks",
  },
  {
    title: "API Development",
    description: "Robust and scalable API solutions",
    icon: <Database className="h-6 w-6 text-primary" />,
    price: "Starting at $400",
    deliveryTime: "1-3 weeks",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    content:
      "Working with Ananta was a pleasure. He delivered our project on time and exceeded our expectations with the quality of his work.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    company: "Global Solutions",
    content:
      "Ananta's attention to detail and problem-solving skills are exceptional. He quickly understood our requirements and delivered a perfect solution.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    company: "Creative Studios",
    content:
      "I was impressed by Ananta's communication skills and professionalism. He kept us updated throughout the project and was always responsive.",
    rating: 4,
  },
]

// Import missing icons
function Code(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )
}

function Palette(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  )
}

function ShoppingCart(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1"></circle>
      <circle cx="19" cy="21" r="1"></circle>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
    </svg>
  )
}

function Database(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  )
}

export default function HireMeSection() {
  const [activeTab, setActiveTab] = useState("contact")

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl opacity-70"
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">Hire Me</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            Ready to bring your ideas to life? I'm available for freelance projects, collaborations, and full-time
            opportunities. Get in touch through any of the platforms below.
          </p>
        </motion.div>

        <Tabs defaultValue="contact" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="contact">Contact Platforms</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.08, 0.3),
                    ease: "easeOut",
                  }}
                >
                  <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${platform.color}15` }}>
                          {platform.icon}
                        </div>
                        <CardTitle className="text-xl">{platform.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">{platform.username}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                      <div className="space-y-2">
                        {platform.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        className="w-full gap-2 group relative overflow-hidden"
                        style={{
                          backgroundColor: platform.color,
                          color: platform.id === "upwork" || platform.id === "fiverr" ? "white" : undefined,
                        }}
                      >
                        <Link href={platform.link} target="_blank" rel="noopener noreferrer">
                          <span
                            className="absolute inset-0 w-full h-full bg-white/20 group-hover:animate-shimmer"
                            style={{ transform: "translateX(-100%)" }}
                          />
                          {platform.cta}
                          <ExternalLink size={16} />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 bg-secondary/30 p-6 rounded-lg border"
            >
              <h3 className="text-xl font-bold mb-4">Quick Response Guarantee</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Fast Communication</h4>
                    <p className="text-sm text-muted-foreground">I respond to all inquiries within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Project Timeline</h4>
                    <p className="text-sm text-muted-foreground">Clear project schedules with regular updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Availability</h4>
                    <p className="text-sm text-muted-foreground">Available for meetings in your timezone</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={activeTab === "services" ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-primary/10">{service.icon}</div>
                        <CardTitle>{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{service.description}</p>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary/70" />
                          <span className="text-sm font-medium">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary/70" />
                          <span className="text-sm font-medium">{service.deliveryTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full gap-2 group relative overflow-hidden">
                        <Link href="mailto:anantasharma510@gmail.com">
                          <span
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"
                            style={{ transform: "translateX(-100%)" }}
                          />
                          <Send size={16} />
                          Request Quote
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={activeTab === "testimonials" ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <CardDescription>{testimonial.company}</CardDescription>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss your project requirements and create something amazing together. I'm currently available for
            new opportunities.
          </p>
          <Button size="lg" asChild className="gap-2 group relative overflow-hidden">
            <Link href="mailto:anantasharma510@gmail.com">
              <span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"
                style={{ transform: "translateX(-100%)" }}
              />
              <Send size={18} />
              Get in Touch
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
