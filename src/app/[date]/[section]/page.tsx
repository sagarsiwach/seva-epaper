"use client"

import { useEffect, useState, use } from "react"
import { Header } from "@/components/layout/Header"
import { PageFlipViewer } from "@/components/viewer/PageFlipViewer"
import { useViewerStore } from "@/stores/viewer-store"
import { Section, Page } from "@/types/edition"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

// =============================================
// SECTION PAGE - Complete Rewrite
// Clean data fetching and viewer integration
// =============================================

interface SectionPageProps {
    params: Promise<{
        date: string
        section: string
    }>
}

interface ApiPage {
    id: string
    sectionId: string
    pageNumber: number
    imageUrl: string
    title?: string
    description?: string
    createdAt: string
}

interface ApiSection {
    id: string
    editionId: string
    name: string
    displayName: string
    order: number
    createdAt: string
    pages: ApiPage[]
}

interface ApiEdition {
    id: string
    date: string
    editionNumber: number
    publication: string
    title?: string
    description?: string
    coverImage?: string
    createdAt: string
    updatedAt: string
    sections: ApiSection[]
}

export default function SectionPage({ params }: SectionPageProps) {
    const resolvedParams = use(params)
    const [sectionData, setSectionData] = useState<Section | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { setCurrentEdition, setCurrentSection, reset } = useViewerStore()

    // Reset store on mount
    useEffect(() => {
        reset()
    }, [reset])

    // Fetch edition data
    useEffect(() => {
        const fetchEdition = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await fetch(`/api/editions/${resolvedParams.date}`)

                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Edition not found for this date")
                    } else {
                        setError("Failed to load edition")
                    }
                    setLoading(false)
                    return
                }

                const edition: ApiEdition = await res.json()

                // Find the requested section
                const section = edition.sections.find(
                    (s) => s.name === resolvedParams.section
                )

                if (!section) {
                    setError(`Section "${resolvedParams.section}" not found`)
                    setLoading(false)
                    return
                }

                // Convert API pages to Page type
                const pages: Page[] = section.pages
                    .sort((a, b) => a.pageNumber - b.pageNumber)
                    .map((p: ApiPage) => ({
                        id: p.id,
                        sectionId: p.sectionId,
                        pageNumber: p.pageNumber,
                        imageUrl: p.imageUrl,
                        thumbnailUrl: p.imageUrl,
                        width: 1280,
                        height: 1920,
                        title: p.title || `Page ${p.pageNumber}`,
                        description: p.description,
                        articles: [],
                        createdAt: p.createdAt,
                    }))

                const convertedSection: Section = {
                    id: section.id,
                    editionId: section.editionId,
                    name: section.name,
                    displayName: section.displayName,
                    order: section.order,
                    coverImage: "",
                    pages,
                    createdAt: section.createdAt,
                }

                setSectionData(convertedSection)
                setCurrentEdition(resolvedParams.date)
                setCurrentSection(resolvedParams.section)
                setLoading(false)
            } catch (err) {
                console.error("Error loading section:", err)
                setError("Failed to load section. Please try again.")
                setLoading(false)
            }
        }

        fetchEdition()
    }, [
        resolvedParams.date,
        resolvedParams.section,
        setCurrentEdition,
        setCurrentSection,
    ])

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8" />
                    <p className="text-sm font-mono text-muted-foreground">
                        Loading edition...
                    </p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !sectionData) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md rounded-none">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-destructive/10">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <CardTitle className="text-xl">Unable to Load</CardTitle>
                        <CardDescription className="font-mono">
                            {error || "Section not found"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button asChild variant="outline" className="w-full rounded-none">
                            <Link href="/archive">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Browse Archive
                            </Link>
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full rounded-none"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Success state - render viewer
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header date={resolvedParams.date} publication="E-Paper" />
            <PageFlipViewer pages={sectionData.pages} sectionId={sectionData.id} />
        </div>
    )
}
