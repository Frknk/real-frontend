export type Category = {
    id: number;
    name: string;
    description: string;
}

export type Brand = {
    id: number;
    name: string;
}

export type Provider = {
    id: number;
    ruc: number;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export type Product = {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    category: Category;
    brand: Brand;
    provider: Provider;
}

export type Sale = {
    id: number
    customer_dni : number
    total : number
    created_at : string
}

export type Customer = {
    id: number
    dni : number
    name: string
    last_name: string
    email : string
}