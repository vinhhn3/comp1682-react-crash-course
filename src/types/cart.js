import { mapProduct } from './product';

/**
 * The cart arrives as `{ product_id, qty, product }`.
 * The app wants `{ id, title, price, emoji, qty }`.
 * One translator, in one place, like products.
 */
export function mapCartLine(dto) {
  const product = mapProduct(dto.product);

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    emoji: product.emoji,
    qty: dto.qty,
  };
}

export function mapCartLines(dtos) {
  return dtos.map(mapCartLine);
}
