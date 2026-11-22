export const getProducts = async (query, signal) => {
  const res = await fetch(`/api/products?q=${query}`, { signal });
  return res.json();
};
