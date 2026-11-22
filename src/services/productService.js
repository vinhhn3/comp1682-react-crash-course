import { http } from './http';
import { mapProduct, mapProducts } from '../types/product';

/**
 * One function per endpoint. No React, no loading flags, no components.
 * URLs live here and nowhere else.
 */
export const productService = {
  async getAll({ query = '', signal } = {}) {
    const path = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
    const dtos = await http.get(path, { signal });
    return mapProducts(dtos);
  },

  async getById(id, { signal } = {}) {
    const dto = await http.get(`/products/${id}`, { signal });
    return mapProduct(dto);
  },

  async getCategories({ signal } = {}) {
    const products = await this.getAll({ signal });
    return [...new Set(products.map((product) => product.category))];
  },
};
