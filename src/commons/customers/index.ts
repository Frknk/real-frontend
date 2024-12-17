import axios from "@/commons/api";


export async function getCustomers() {
    const { data } = await axios.get('/customers')
    return data
    }

export async function createCustomer(data) {
    await axios.post('/customers', data)
}