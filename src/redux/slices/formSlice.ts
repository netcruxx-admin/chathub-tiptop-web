'use client'

import { createSlice } from '@reduxjs/toolkit'
import { OcrExtract } from '../apis/ocrApi'

// interface OcrData {
// 	FirstName: string
// 	LastName: string
// 	FatherName: string
// 	DOB: string
// 	Sex: string
// 	Address1: string
// 	City: string
// 	State: string
// 	Country: string
// 	Zip: string
// 	GovtID: string
// 	source: string
// }

interface FormState {
  ocrData: OcrExtract | null
}

const initialState: FormState = {
  ocrData: null,
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateAadhaarData: (state, action: { payload: OcrExtract }) => {
      state.ocrData = action.payload
    },
    clearAadhaarData: state => {
      state.ocrData = null
    },
  },
})

export const { updateAadhaarData, clearAadhaarData } = formSlice.actions
export default formSlice.reducer