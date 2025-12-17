"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Newspaper, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await fetch("/api/editions?limit=1")
                const editions = await res.json()

                if (editions && editions.length > 0) {
                    const latestEdition = editions[0]
                    if (latestEdition.sections && latestEdition.sections.length > 0) {
                        router.push(
                            `/${latestEdition.date}/${latestEdition.sections[0].name}`
                        )
                        return
                    }
                }
                setError("No editions available")
            } catch (err) {
                console.error("Error fetching latest edition:", err)
                setError("Failed to load editions")
            } finally {
                setLoading(false)
            }
        }

        fetchLatest()
    }, [router])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6">
                    {/* Logo */}
                    <div className="flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground">
                        <Newspaper className="h-8 w-8" />
                    </div>

                    {/* Loading State */}
                    <div className="flex flex-col items-center gap-3">
                        <Spinner className="h-8 w-8" />
                        <p className="text-sm font-mono text-muted-foreground">
                            Loading today&apos;s edition...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md rounded-none">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-muted">
                            <Newspaper className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-xl">E-Paper Viewer</CardTitle>
                        <CardDescription className="font-mono">{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button asChild className="w-full rounded-none">
                            <Link href="/archive">
                                Browse Archive
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="w-full rounded-none"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Card className="w-full max-w-md rounded-none">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                        <Newspaper className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Welcome to E-Paper Viewer</CardTitle>
                    <CardDescription className="font-mono">
                        Your digital newspaper experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Button asChild className="w-full rounded-none">
                        <Link href="/archive">
                            Browse Editions
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
