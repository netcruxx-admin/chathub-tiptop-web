import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { JobFilters, AcademyTab, Job, StageAData, StageBData, StageCData } from '@/types'

interface JobsState {
  showFilters: boolean
  filters: JobFilters
  selectedJob: Job | null
  academyTab: AcademyTab
  showStageBGate: boolean
  stageAData: StageAData | null
  stageBData: StageBData | null
  stageCData: StageCData | null
}

const initialState: JobsState = {
  showFilters: false,
  filters: {
    salaryMin: 0,
    salaryMax: 100000,
    location: '',
    hasTraining: false,
    hasCertification: false,
    skillLevel: 'all',
    trainingType: 'all',
    maxDistance: 50,
    paymentType: 'all',
  },
  selectedJob: null,
  academyTab: 'courses',
  showStageBGate: false,
  stageAData: null,
  stageBData: null,
  stageCData: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload
    },
    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload
    },
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload
    },
    setAcademyTab: (state, action: PayloadAction<AcademyTab>) => {
      state.academyTab = action.payload
    },
    setShowStageBGate: (state, action: PayloadAction<boolean>) => {
      state.showStageBGate = action.payload
    },
    setStageAData: (state, action: PayloadAction<StageAData | null>) => {
      state.stageAData = action.payload
    },
    setStageBData: (state, action: PayloadAction<StageBData | null>) => {
      state.stageBData = action.payload
    },
    setStageCData: (state, action: PayloadAction<StageCData | null>) => {
      state.stageCData = action.payload
    },
    resetJobs: () => initialState,
  },
})

export const {
  setShowFilters,
  setFilters,
  setSelectedJob,
  setAcademyTab,
  setShowStageBGate,
  setStageAData,
  setStageBData,
  setStageCData,
  resetJobs,
} = jobsSlice.actions

export default jobsSlice.reducer
