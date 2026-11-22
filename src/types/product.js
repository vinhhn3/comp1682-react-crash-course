/**
 * The translator.
 *
 * The server speaks snake_case and cents. The app speaks camelCase and dollars.
 * This file is the only place that knows both vocabularies. If the backend
 * renames a field, you change one function — not forty components.
 */
export function mapProduct(dto) {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    price: dto.price_cents / 100,
    rating: dto.rating,
    emoji: dto.emoji,
    stock: dto.stock_qty,
    createdAt: new Date(dto.created_at),
  };
}

export function mapProducts(dtos) {
  return dtos.map(mapProduct);
}
