"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import Select from "react-select";
import InvoiceComponent from "./InvoiceComponent";

// تعريف نوع المنتج
interface Product {
  id: number;
  name: string;
  sellPrice: number;
  quantity: number;
  imagePath?: string;
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
  const [searchTerm, setSearchTerm] = useState<string>("");

  // حالة السلة
  const [cart, setCart] = useState<CartItem[]>([]);

 
  // جلب البيانات من API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Material`
      );
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

  useEffect(() => {
    // fetchCustomers();
    // fetchExhibition();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

 

  return (
    <div className="grid items-start justify-items-center min-h-screen  pb-12 gap-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <Link
        href={"/admin"}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out justify-self-end"
      >
        Admin
      </Link>
      <div className="grid items-start justify-items-between w-full  grid-cols-4 gap-5 ">
        <div className="flex-col items-start  justify-center min-h-screen col-span-3 gap-4 font-[family-name:var(--font-geist-sans)]">
          <h1 className="text-2xl font-bold p-2 text-center">Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-lg p-2 w-full  "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <p className="text-gray-600 p-4 text-center">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-2 shadow-md flex flex-col items-center text-center"
                >
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    className="w-32 h-32 object-fit-contain mb-4"
                  />
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p
                    className={`${
                      product.sellPrice === 0 ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    Price:
                    {product.sellPrice === 0
                      ? "اضف سعر"
                      : "$" + product.sellPrice}
                  </p>
                  <p
                    className={
                      product.quantity === 0 ? "text-red-500" : "text-gray-600"
                    }
                  >
                    Quantity:{" "}
                    {product.quantity > 0 ? product.quantity : "Out of Stock"}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.quantity <= 0 || product.sellPrice === 0}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>{" "}
        {/* Cart */}
        <div className="col-span-1 w-full">
          <InvoiceComponent
            cart={cart}
            setCart={setCart}
            handleRemoveFromCart={handleRemoveFromCart}
          />
        </div>
      </div>
    </div>
  );
}
