"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Search, Trash2, RefreshCw } from "lucide-react"
import { SearchHistoryItem } from "@/lib/search-history"
import type { SearchParams } from "@/lib/types"

interface SearchHistoryProps {
  onSelectSearch?: (params: Omit<SearchHistoryItem, 'timestamp'>) => void
}

export function SearchHistory({ onSelectSearch }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search-history`)

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view search history.")
          setHistory([])
          return
        }
        throw new Error(`Failed to fetch search history (${response.status})`)
      }

      const data = await response.json()

      if (data.success) {
        setHistory(data.history || [])
      } else {
        setError(data.error || "Failed to fetch search history")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear your search history?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/search-history`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to clear search history.")
          return
        }
        throw new Error(`Failed to clear search history (${response.status})`)
      }

      const data = await response.json()

      if (data.success) {
        setHistory([])
      } else {
        setError(data.error || "Failed to clear search history")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const handleSelectSearch = (item: SearchHistoryItem) => {
    if (onSelectSearch) {
      const { timestamp, ...paramsToPass } = item
      onSelectSearch(paramsToPass)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Searches</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} disabled={isLoading}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-sm text-red-500 mb-2">{error}</div>}

        {history.length === 0 ? (
          <div className="text-center py-4 text-gray-500">{isLoading ? "Loading..." : "No search history found"}</div>
        ) : (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="border rounded-md p-2 hover:bg-gray-50">
                <button className="w-full text-left" onClick={() => handleSelectSearch(item)} disabled={isLoading}>
                  <div className="flex items-center flex-wrap">
                    <Search className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="font-medium mr-1">{item.term}{item.industry ? ` ${item.industry}` : ''}</span>
                    <span className="mx-1 text-gray-400">in</span>
                    <span className="font-medium mr-2">{item.location}</span>
                    <span className="text-xs text-gray-500">(Count: {item.count})</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(item.timestamp)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
