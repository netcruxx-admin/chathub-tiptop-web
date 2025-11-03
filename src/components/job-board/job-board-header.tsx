"use client"

import { Button } from "@/components/ui/button"
import { ProfileCompletionBadge } from "@/components/ui/profile-completion-badge"
import * as Icons from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setShowFilters } from "@/redux/slices/jobsSlice"

export function JobBoardHeader() {
  const dispatch = useAppDispatch()
  const showFilters = useAppSelector((state) => state.jobs.showFilters)

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              // onClick={() => setCurrentScreen("stageAComplete")}
              className="mr-2 flex-shrink-0"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">Jobs Near You</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Based on your location</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              // onClick={() => setCurrentScreen("settings")}
              className="h-8 px-2 gap-1 hidden sm:flex"
            >
              <Icons.Globe className="w-3.5 h-3.5" />
              {/* <span className="font-medium text-xs">{languageDisplay.code}</span> */}
            </Button>
            <ProfileCompletionBadge
              percentage={20}
              // onClick={() => setCurrentScreen("profile")}
              size="sm"
            />
            <Button variant="ghost" size="icon"
            //  onClick={() => setCurrentScreen("profile")} 
             className="h-8 w-8">
              <Icons.User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(setShowFilters(!showFilters))}
              className="h-8 w-8"
            >
              <Icons.Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
