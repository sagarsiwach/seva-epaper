"use client"

import { use, useEffect, useState } from "react"
import { Viewer } from "@/components/viewer/Viewer"
import type { Edition } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

interface EditionPageProps {
  params: Promise<{ editionId: string }>
}

export default function EditionPage({ params }: EditionPageProps) {
  const { editionId } = use(params)
  const [edition, setEdition] = useState<Edition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEdition = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/editions/${editionId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setError("Edition not found")
          } else {
            setError("Failed to load edition")
          }
          return
        }

        const data = await res.json()
        setEdition(data.edition)
      } catch (err) {
        console.error("Error loading edition:", err)
        setError("Failed to load edition")
      } finally {
        setLoading(false)
      }
    }

    fetchEdition()
  }, [editionId])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-48 w-32" />
            <Skeleton className="h-48 w-32" />
          </div>
          <p className="text-sm font-mono text-muted-foreground animate-pulse">
            Loading edition...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !edition) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold">Unable to Load</h2>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/archive">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Archive
              </Link>
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success - render viewer
  return <Viewer pages={edition.pages} title={edition.title} />
}
