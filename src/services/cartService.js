import { http } from './http';
import { mapCartLines } from '../types/cart';
import { logEvent } from '../lib/devlog';

/**
 * Every mutation returns the whole cart. That is a deliberate API choice: the
 * client never has to guess what changed, so there is nothing to get out of sync.
 *
 * The wire shape is `{ items: [...] }`. The app shape is `[...]`. The unwrapping
 * happens here, once, so no component ever sees the envelope.
 */
export const cartService = {
  async get({ signal } = {}) {
    const payload = await http.get('/cart', { signal });
    return mapCartLines(payload.items);
  },

  async add(productId) {
    logEvent('service', 'cartService.add', `POST /cart ${productId}`);
    const payload = await http.post('/cart', { product_id: productId, qty: 1 });
    return mapCartLines(payload.items);
  },

  async setQty(productId, qty) {
    logEvent('service', 'cartService.setQty', `PATCH /cart/${productId} qty=${qty}`);
    const payload = await http.patch(`/cart/${productId}`, { qty });
    return mapCartLines(payload.items);
  },

  async remove(productId) {
    logEvent('service', 'cartService.remove', `DELETE /cart/${productId}`);
    const payload = await http.delete(`/cart/${productId}`);
    return mapCartLines(payload.items);
  },
};
