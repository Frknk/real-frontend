import axios from '@/commons/api';

export async function getSales() {
    const { data } = await axios.get('/sales')
    return data
}

export async function getSale(id) {
    const { data } = await axios.get(`/sales/${id}`)
    return data
}

export async function createSale(sale) {
    
    const { data } = await axios.post('/sales', sale)
    return data
}