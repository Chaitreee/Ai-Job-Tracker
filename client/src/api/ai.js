import axiosInstance from '../utils/axiosInstance'

// POST /ai/upload-resume (multipart/form-data)
export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('resume', file)

  return axiosInstance.post('/ai/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// POST /ai/match
export const matchResume = (jobDescription) => {
  return axiosInstance.post('/ai/match', { jobDescription })
}