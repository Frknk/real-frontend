import axios from '@/commons/api';

export async function getProducts() {
    const { data } = await axios.get('/products')
    return data
}

export async function createProduct(product) {
    const response = await axios.post('/products', {
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price,
        provider_name: product.provider,
        category_name: product.category,
        brand_name: product.brand
      })
    return response.data
}

export async function deleteProduct(id) {
    const response = await axios.delete(`/products/${id}`)
    return response.data
}

export async function getProduct(id) {
    const response = await axios.get(`/products/${id}`)
    return response.data
}

export async function updateProduct(id, product) {
    const response = await axios.patch(`/products/${id}`, {
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price,
        provider_name: product.provider,
        category_name: product.category,
        brand_name: product.brand
      })
    return response.data
}