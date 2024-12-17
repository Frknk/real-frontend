import axios from '@/commons/api';

export async function getBrands() {
  const { data } = await axios.get('/brands')
  return data
}

export async function createBrand(data) {
  const response = await axios.post('/brands', data)
  return response.data
}