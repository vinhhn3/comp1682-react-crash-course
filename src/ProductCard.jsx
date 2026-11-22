const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="card">
      <h2>{product.title}</h2>
      <p>{product.category}</p>
      <p>${product.price}</p>
      <button onClick={onAdd}>Add to cart</button>
    </div>
  );
};

export default ProductCard;
