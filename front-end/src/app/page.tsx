"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Code, BookOpen, Users, Sparkles } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2 pb-8">
                  <h1 className="md:pb-4 text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Where developers grow together
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    DEV Community is a vibrant space where developers share knowledge, collaborate, and build their professional network.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {!isAuthenticated ? (
                    <Button asChild size="lg" className="bg-primary text-primary-foreground">
                      <Link href="/auth/register">Join the Community</Link>
                    </Button>
                  ) : null}
                  <Button asChild variant="outline" size="lg">
                    <Link href="/posts/new">Share Your Knowledge</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center">
                <div className="space-y-4 backdrop-blur-[2px] rounded-lg border bg-background/95 p-8 shadow-lg">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Trending Topics
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Discover what developers are talking about
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["javascript", "webdev", "programming", "beginners", "react", "python"].map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-sm font-semibold transition-colors hover:bg-muted"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Share Code</h3>
                <p className="text-muted-foreground">
                  Share your code snippets and get feedback from the community.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Learn Together</h3>
                <p className="text-muted-foreground">
                  Access high-quality articles written by developers for developers.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Build Network</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded developers and grow your network.
                </p>
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Stay Updated</h3>
                <p className="text-muted-foreground">
                  Keep up with the latest trends and technologies in software development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* Left Sidebar */}
            <aside className="hidden lg:block space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Start Writing</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Share your knowledge and experiences with our growing developer community.
                </p>
                <Button asChild className="w-full">
                  <Link href="/posts/new">Create a Post</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About DEV Community
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                      Writing Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      Contact Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/code-of-conduct" className="text-muted-foreground hover:text-foreground">
                      Code of Conduct
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Main Content - Latest Posts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
                <Button asChild variant="ghost">
                  <Link href="/latest">View all</Link>
                </Button>
              </div>
              <PostList />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
