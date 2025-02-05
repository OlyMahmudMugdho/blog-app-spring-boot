"use client"

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">About DEV</h1>
            <p className="text-muted-foreground">
              A community for developers to share, learn, and connect
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Our Mission</h2>
            <p>
              DEV is a community of software developers getting together to help one another out.
              The software industry relies on collaboration and networked learning.
              We provide a place for that to happen.
            </p>

            <h2>What We Offer</h2>
            <ul>
              <li>
                <strong>Write Articles</strong> - Share your knowledge and experiences with the community
              </li>
              <li>
                <strong>Read and Learn</strong> - Access high-quality technical content written by developers
              </li>
              <li>
                <strong>Engage in Discussions</strong> - Comment on posts and interact with other developers
              </li>
              <li>
                <strong>Build Your Profile</strong> - Create a professional presence in the developer community
              </li>
            </ul>

            <h2>Technology Stack</h2>
            <p>
              This platform is built with modern technologies:
            </p>
            <ul>
              <li>Next.js - React framework for the frontend</li>
              <li>Spring Boot - Java framework for the backend</li>
              <li>PostgreSQL - Relational database</li>
              <li>Tailwind CSS - Utility-first CSS framework</li>
            </ul>

            <h2>Open Source</h2>
            <p>
              The entire codebase is open source and available on GitHub. We believe in transparency
              and community-driven development. Feel free to contribute or use the code for your own projects.
            </p>

            <h2>Get Started</h2>
            <p>
              Join our community today to start sharing your knowledge and connecting with other developers.
              Whether you're a beginner or an experienced developer, there's a place for you here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 