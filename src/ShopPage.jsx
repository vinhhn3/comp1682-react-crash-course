import ProductCard from './ProductCard';

const products = [
  { id: 1, title: 'Aero Mug', category: 'Kitchen', price: 24 },
  { id: 2, title: 'Halo Headphones', category: 'Audio', price: 89 },
  { id: 3, title: 'Fern Pot', category: 'Home', price: 32 },
];

const ShopPage = ({ onAdd }) => {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => onAdd(product)}
        />
      ))}
    </>
  );
};

export default ShopPage;
