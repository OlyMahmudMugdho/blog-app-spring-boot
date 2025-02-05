"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Github, Twitter } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    })

    setLoading(false)
    event.currentTarget.reset()
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-muted-foreground">
              Get in touch with us for any questions or feedback
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    required
                    disabled={loading}
                    className="min-h-[150px]"
                  />
                </div>
                <Button disabled={loading} className="w-full">
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  )}
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Other Ways to Connect</h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@dev.to"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>contact@dev.to</span>
                  </a>
                  <a
                    href="https://github.com/OlyMahmudMugdho/blog-app-spring-boot"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://twitter.com/OlyMahmudMugdho"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">FAQs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">How do I create an account?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the "Create account" button in the top right corner and follow the instructions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">How do I write a post?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      After logging in, click the "Write a Post" button in the navigation bar.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Is it free to use?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes, DEV is completely free to use. Create an account and start sharing your knowledge!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 