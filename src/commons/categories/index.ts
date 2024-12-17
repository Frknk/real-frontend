import axios from '@/commons/api';

export async function getCategories() {
  const { data } = await axios.get('/categories')
  return data
}

export async function createCategory(data) {
  const response = await axios.post('/categories', data)
  return response.data
}