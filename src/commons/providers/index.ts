import axios from '@/commons/api';

export async function getProviders() {
    const { data } = await axios.get('/providers')
    return data
    }

export async function createProvider(data) {
    const response = await axios.post('/providers', data)
    return response.data
    }