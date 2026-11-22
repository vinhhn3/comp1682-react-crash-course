const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <h2>{product.title}</h2>
      <p>{product.category}</p>
      <p>${product.price}</p>
      <button>Add to cart</button>
    </div>
  );
};

export default ProductCard;
