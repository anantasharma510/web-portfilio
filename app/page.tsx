import HeroSection from "@/components/hero-section"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import ExperienceSection from "@/components/experience-section"
import ContactSection from "@/components/contact-section"
import ScrollProgressBar from "@/components/scroll-progress-bar"
import EnhancedSocialSidebar from "@/components/enhanced-social-sidebar"

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <EnhancedSocialSidebar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ExperienceSection />
      <ContactSection />
    </>
  )
}
