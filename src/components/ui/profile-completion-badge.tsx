"use client"

interface ProfileCompletionBadgeProps {
  percentage: number
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeConfig = {
  sm: { width: 40, radius: 16, strokeWidth: 2.5, fontSize: "text-[10px]" },
  md: { width: 48, radius: 20, strokeWidth: 3, fontSize: "text-xs" },
  lg: { width: 56, radius: 24, strokeWidth: 3.5, fontSize: "text-sm" },
}

const getColorClass = (percentage: number) => {
  if (percentage < 34) return "text-red-500" // Needs attention
  if (percentage < 67) return "text-amber-500" // In progress
  return "text-green-500" // Good/Complete
}

export function ProfileCompletionBadge({
  percentage,
  onClick,
  size = "md",
  className = "",
}: ProfileCompletionBadgeProps) {
  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius
  const offset = circumference * (1 - percentage / 100)
  const colorClass = getColorClass(percentage)

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className}`}
      style={{ width: config.width, height: config.width }}
    >
      <svg className="transform -rotate-90" width={config.width} height={config.width}>
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-muted-foreground/20"
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-300`}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute ${config.fontSize} font-bold ${colorClass}`}>{percentage}%</span>
    </button>
  )
}
