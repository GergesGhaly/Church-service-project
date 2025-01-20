"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// تعريف نوع المنتج
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// تعريف نوع المنتج داخل السلة
interface CartItem extends Product {
  quantity: number; // الكمية داخل السلة
}

export default function Home() {
  // حالة المنتجات
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // حالة السلة
  const [cart, setCart] = useState<CartItem[]>([]);

  // جلب البيانات من API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // إذا كان الخطأ من النوع Error
        } else {
          setError("An unknown error occurred."); // في حال كان الخطأ من نوع غير معروف
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // وظيفة إضافة المنتج إلى السلة
  const handleAddToCart = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );

    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    if (!selectedProduct) return;

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...selectedProduct, quantity: 1 }];
      }
    });
  };

  // وظيفة حذف المنتج من السلة
  const handleRemoveFromCart = (productId: number) => {
    const productToRemove = cart.find((item) => item.id === productId);
    if (!productToRemove) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + productToRemove.quantity,
            }
          : product
      )
    );

    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // وظيفة الطباعة
  const handlePrint = () => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const cartDetails = cart
      .map((item) => `${item.name} - $${item.price} x ${item.quantity}`)
      .join("\n");
    const printContent = `Cart Items:\n${cartDetails}\n\nTotal Price: $${totalPrice}`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="grid items-start justify-items-center min-h-screen  pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Link
        href={"/admin"}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out justify-self-end"
             
            >
            Admin
            </Link>
      <h1 className="text-2xl font-bold">Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-md flex flex-col items-center text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-gray-600">
                Quantity:{" "}
                {product.quantity > 0 ? product.quantity : "Out of Stock"}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                onClick={() => handleAddToCart(product.id)}
                disabled={product.quantity === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-bold mt-10">Cart</h1>
      <div className="w-full max-w-2xl text-center">
        {cart.length > 0 ? (
          <div className="grid gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
              onClick={handlePrint}
            >
              Print Cart
            </button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
