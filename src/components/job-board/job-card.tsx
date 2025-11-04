"use client"

// import { SkillBadge } from "@/components/ui/skill-badge"
import type { Job } from "@/types/job"
import type { JobPosting } from "@/redux/apis/jobBoardApi"
import { MapPin, Star } from "lucide-react"
import { useRouter } from "next/navigation"

type JobCardProps =
  | {
      job: Job
      jobPosting?: never
      canApply: boolean
      userSkillLevel?: "gray" | "yellow" | "green"
    }
  | {
      job?: never
      jobPosting: JobPosting
      canApply: boolean
      userSkillLevel?: "gray" | "yellow" | "green"
    }

export function JobCard({ job, jobPosting, canApply, userSkillLevel }: JobCardProps) {
  const router = useRouter()

  const handleJobClick = () => {
    if (jobPosting) {
      router.push(`/job-details/${jobPosting.Id}`)
    } else if (job) {
      // For mock jobs, use their numeric ID (though we shouldn't have these anymore)
      router.push(`/job-details/${job.id}`)
    }
  }

  const getSkillLevelLabel = (level: "gray" | "yellow" | "green") => {
    if (level === "gray") return "Unverified"
    if (level === "yellow") return "Verified"
    return "Certified"
  }

  // If rendering JobPosting from API
  if (jobPosting) {
    return (
      <div
        className="bg-card rounded-lg p-4 mb-3 shadow-sm border cursor-pointer hover:shadow-md transition-all"
        onClick={handleJobClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-0.5 truncate">{jobPosting.Title}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {jobPosting.CompanyDetail} • {jobPosting.Location}
            </p>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <span className="text-primary font-bold text-base">
              ₹{jobPosting.SalaryFrom.toLocaleString()}-{jobPosting.SalaryTo.toLocaleString()}
            </span>
            <p className="text-[10px] text-muted-foreground">/month</p>
          </div>
        </div>

        {/* Description */}
        {jobPosting.Description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {jobPosting.Description}
          </p>
        )}

        {/* Qualifications */}
        {jobPosting.Qualification && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🎓 {jobPosting.Qualification}
            </span>
          </div>
        )}

        {/* Available Positions */}
        {jobPosting.AvailablePositionCount > 0 && (
          <div className="text-xs text-muted-foreground mb-2">
            👥 {jobPosting.AvailablePositionCount} {jobPosting.AvailablePositionCount === 1 ? 'position' : 'positions'} available
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{jobPosting.Location}</span>
          </div>
        </div>
      </div>
    )
  }

  // If rendering Job (mock data)
  if (!job) return null

  return (
    <div
      className="bg-card rounded-lg p-4 mb-3 shadow-sm border cursor-pointer hover:shadow-md transition-all"
      onClick={handleJobClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-0.5 truncate">{job.title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {job.company} • {job.location}
          </p>
        </div>
        <div className="text-right ml-2 flex-shrink-0">
          <span className="text-primary font-bold text-base">
            ₹{job.salaryMin.toLocaleString()}-{job.salaryMax.toLocaleString()}
          </span>
          <p className="text-[10px] text-muted-foreground">
            {job.paymentType === "daily"
              ? "/day"
              : job.paymentType === "weekly"
                ? "/week"
                : job.paymentType === "monthly"
                  ? "/month"
                  : "/task"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {job.requiredSkillLevel === "gray" ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            ✓ No cert needed
          </span>
        ) : job.requiredSkillLevel === "yellow" ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            ★ Verified skills needed
          </span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ✓ Certified required
          </span>
        )}
        {userSkillLevel && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Your level:</span>
            {/* <SkillBadge skill={getSkillLevelLabel(userSkillLevel)} level={userSkillLevel} showLevel /> */}
          </div>
        )}
      </div>

      {job.training && (
        <div
          className={`rounded-md p-2 mb-2 ${
            job.training.type === "csr" ? "bg-primary/10 border border-primary/30" : "bg-muted border border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${job.training.type === "csr" ? "text-primary" : "text-foreground"}`}>
              {job.training.type === "csr" ? "🎓 Free Training" : "📚 Training Available"}
            </span>
            {job.training.cost > 0 && (
              <span className="text-xs font-semibold">₹{job.training.cost.toLocaleString()}</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {job.training.duration} • {job.training.provider}
          </p>
        </div>
      )}

      {!canApply && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-2 mb-2">
          <p className="text-[10px] text-orange-700 font-medium">
            {job.requiredSkillLevel === "yellow"
              ? "Complete 5 tasks (4+ rating) to unlock"
              : job.training?.type === "csr"
                ? "Get free certification to apply"
                : "Certification required"}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{job.distance} km</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <span>Level {job.skillLevel}</span>
        </div>
      </div>
    </div>
  )
}
