import type { StageAData, StageBData, StageCData } from "@/types"

export function calculateProfileCompletion(
  phoneNumber: string,
  username: string,
  email: string,
  stageAData: StageAData,
  stageBData: StageBData,
  stageCData: StageCData,
): number {
  let completion = 0

  // Basic Information (13% total)
  if (phoneNumber) completion += 3 // Phone verified via OTP
  if (username) completion += 2 // Username set
  if (email) completion += 2 // Email generated
  if (stageAData.firstName) completion += 3 // First name
  if (stageAData.lastName) completion += 3 // Last name

  // Personal Details (17% total)
  if (stageAData.dateOfBirth) completion += 3 // Date of birth
  if (stageAData.primarySkills.length > 0) completion += 7 // At least one skill
  if (stageAData.jobRadius > 0) completion += 7 // Job search radius set

  // Stage B - Detailed Profile (45% total)
  if (stageBData.sex) completion += 5 // Gender
  if (stageBData.aadhaarNumber) completion += 5 // Aadhaar number
  if (stageBData.currentAddress.line1) completion += 3 // Address line 1
  if (stageBData.currentAddress.city) completion += 3 // City
  if (stageBData.currentAddress.state) completion += 3 // State
  if (stageBData.currentAddress.pincode) completion += 3 // Pincode
  if (stageBData.permanentAddress.line1) completion += 3 // Permanent address
  if (stageBData.highestQualification) completion += 8 // Qualification
  if (stageBData.hasExperience !== undefined) {
    if (stageBData.hasExperience && stageBData.workExperience.length > 0) {
      completion += 10 // Work experience details
    } else if (!stageBData.hasExperience) {
      completion += 10 // Marked as no experience
    }
  }
  if (stageBData.willingToRelocate !== undefined) completion += 2 // Relocation preference

  // Stage C - Optional Enhancements (25% total)
  const stageCFields = [
    stageCData.emergencyPhone ? 4 : 0,
    stageCData.panCard ? 4 : 0,
    stageCData.bloodGroup ? 3 : 0,
    stageCData.references.length > 0 ? 4 : 0,
    stageCData.careerSummary ? 3 : 0,
    stageCData.careerObjective ? 3 : 0,
    stageCData.workPreferences.workType.length > 0 ? 4 : 0,
  ]
  completion += stageCFields.reduce((sum, val) => sum + val, 0)

  // Cap at 100%
  return Math.min(completion, 100)
}

export function getProfileStage(
  phoneNumber: string,
  username: string,
  email: string,
  stageAData: StageAData,
  stageBData: StageBData,
  stageCData: StageCData,
): "A" | "B" | "C" {
  const completion = calculateProfileCompletion(phoneNumber, username, email, stageAData, stageBData, stageCData)

  if (completion >= 75) return "C"
  if (completion >= 30) return "B"
  return "A"
}
