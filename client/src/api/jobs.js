import axiosInstance from '../utils/axiosInstance'

// GET /jobs?status=&search=&sort=
export const getJobs = (params = {}) => {
  return axiosInstance.get('/jobs', { params })
}

// GET /jobs/:id
export const getJobById = (id) => {
  return axiosInstance.get(`/jobs/${id}`)
}

// GET /jobs/stats
export const getJobStats = () => {
  return axiosInstance.get('/jobs/stats')
}

// POST /jobs
export const createJob = (jobData) => {
  return axiosInstance.post('/jobs', jobData)
}

// PUT /jobs/:id
export const updateJob = (id, jobData) => {
  return axiosInstance.put(`/jobs/${id}`, jobData)
}

// DELETE /jobs/:id
export const deleteJob = (id) => {
  return axiosInstance.delete(`/jobs/${id}`)
}