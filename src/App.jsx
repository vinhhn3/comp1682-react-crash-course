const products = [
  { id: 1, title: 'Aero Mug', category: 'Kitchen', price: 24 },
  { id: 2, title: 'Halo Headphones', category: 'Audio', price: 89 },
  { id: 3, title: 'Fern Pot', category: 'Home', price: 32 },
];

const App = () => {
  return (
    <div className="app">
      <h1>Shop</h1>

      {products.map((product) => (
        <div className="card" key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.category}</p>
          <p>${product.price}</p>
          <button>Add to cart</button>
        </div>
      ))}
    </div>
  );
};

export default App;
