import axiosInstance from '../utils/axiosInstance'

// GET /auth/me
export const getMe = () => {
  return axiosInstance.get('/auth/me')
}