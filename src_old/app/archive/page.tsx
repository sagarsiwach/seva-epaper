"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { generateEditions } from "@/lib/mock-data"
import { Edition } from "@/types/edition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export default function ArchivePage() {
    const router = useRouter()
    const [editions, setEditions] = useState<Edition[]>([])
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const mockEditions = generateEditions(90)
        setEditions(mockEditions)
        setLoading(false)
    }, [])

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const isEditionAvailable = (day: number) => {
        const dateStr = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        )
            .toISOString()
            .split("T")[0]

        return editions.some((e) => e.date === dateStr)
    }

    const getEditionByDay = (day: number) => {
        const dateStr = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        )
            .toISOString()
            .split("T")[0]

        return editions.find((e) => e.date === dateStr)
    }

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        )
    }

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        )
    }

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        )
    }

    const handleDayClick = (day: number) => {
        const edition = getEditionByDay(day)
        if (edition && edition.sections.length > 0) {
            router.push(`/${edition.date}/${edition.sections[0].name}`)
        }
    }

    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const monthName = currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    })

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Spinner className="h-8 w-8" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                date={new Date().toISOString().split("T")[0]}
                publication="E-Paper"
            />

            <main className="container mx-auto max-w-4xl p-4 py-8">
                <Card className="rounded-none border">
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="rounded-none"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <span className="sr-only">Previous Month</span>
                            </Button>

                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                {monthName}
                            </CardTitle>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNextMonth}
                                className="rounded-none"
                            >
                                <ChevronRight className="h-5 w-5" />
                                <span className="sr-only">Next Month</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4">
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Weekday Headers */}
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div
                                    key={day}
                                    className="flex h-10 items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Empty cells */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-16" />
                            ))}

                            {/* Days */}
                            {days.map((day) => {
                                const hasEdition = isEditionAvailable(day)
                                const edition = getEditionByDay(day)
                                const today = isToday(day)

                                return (
                                    <button
                                        key={day}
                                        onClick={() => hasEdition && handleDayClick(day)}
                                        disabled={!hasEdition}
                                        className={cn(
                                            "relative flex h-16 flex-col items-center justify-center gap-1 border transition-colors",
                                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            hasEdition
                                                ? "cursor-pointer border-border bg-card hover:bg-accent hover:border-primary"
                                                : "cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground",
                                            today && "ring-2 ring-primary ring-offset-2"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "text-sm font-mono",
                                                hasEdition ? "font-semibold" : "font-normal"
                                            )}
                                        >
                                            {day}
                                        </span>

                                        {hasEdition && edition && (
                                            <Badge
                                                variant="secondary"
                                                className="h-4 rounded-none px-1.5 text-[10px] font-mono"
                                            >
                                                {edition.sections.length}
                                            </Badge>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex items-center justify-center gap-6 border-t pt-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-4 w-4 border border-border bg-card" />
                                <span className="font-mono">Available</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-4 w-4 bg-muted/30" />
                                <span className="font-mono">Unavailable</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-4 w-4 ring-2 ring-primary ring-offset-1" />
                                <span className="font-mono">Today</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
