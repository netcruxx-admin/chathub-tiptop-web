'use client'

import { createSlice } from '@reduxjs/toolkit'

// Define the shape of the OCR data
interface OcrDataState {
  fullName?: string
  firstName?: string
  lastName?: string
  dob?: string // Will be in DD/MM/YYYY or similar
  gender?: string
  aadhaarNumber?: string
  address?: string
}

interface FormState {
  ocrData: OcrDataState | null
}

const initialState: FormState = {
  ocrData: null,
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Action to save the extracted data
    updateAadhaarData: (state, action: { payload: OcrDataState }) => {
      state.ocrData = action.payload
    },
    // Action to clear the data after the form is populated
    clearAadhaarData: state => {
      state.ocrData = null
    },
  },
})

export const { updateAadhaarData, clearAadhaarData } = formSlice.actions
export default formSlice.reducer