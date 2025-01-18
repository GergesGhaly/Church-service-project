"use client"
import { useState } from "react";

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
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Product 1",
      price: 100,
      quantity: 5,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpRd2-pDu1ns5-WqsNWONoohGcQz1nPVFsjw&s",
    },
    {
      id: 2,
      name: "Product 2",
      price: 200,
      quantity: 10,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Product 3",
      price: 150,
      quantity: 3,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Product 4",
      price: 120,
      quantity: 7,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Product 5",
      price: 180,
      quantity: 15,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "Product 6",
      price: 220,
      quantity: 8,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 7,
      name: "Product 7",
      price: 250,
      quantity: 4,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 8,
      name: "Product 8",
      price: 300,
      quantity: 6,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 9,
      name: "Product 9",
      price: 130,
      quantity: 9,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 10,
      name: "Product 10",
      price: 170,
      quantity: 12,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 11,
      name: "Product 11",
      price: 110,
      quantity: 14,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 12,
      name: "Product 12",
      price: 160,
      quantity: 13,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 13,
      name: "Product 13",
      price: 190,
      quantity: 5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 14,
      name: "Product 14",
      price: 210,
      quantity: 11,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 15,
      name: "Product 15",
      price: 240,
      quantity: 16,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 16,
      name: "Product 16",
      price: 250,
      quantity: 7,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 17,
      name: "Product 17",
      price: 230,
      quantity: 9,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 18,
      name: "Product 18",
      price: 120,
      quantity: 14,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 19,
      name: "Product 19",
      price: 160,
      quantity: 8,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 20,
      name: "Product 20",
      price: 180,
      quantity: 10,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 21,
      name: "Product 21",
      price: 210,
      quantity: 6,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 22,
      name: "Product 22",
      price: 240,
      quantity: 15,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 23,
      name: "Product 23",
      price: 270,
      quantity: 12,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 24,
      name: "Product 24",
      price: 220,
      quantity: 11,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 25,
      name: "Product 25",
      price: 230,
      quantity: 9,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 26,
      name: "Product 26",
      price: 250,
      quantity: 13,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 27,
      name: "Product 27",
      price: 290,
      quantity: 4,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 28,
      name: "Product 28",
      price: 300,
      quantity: 7,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 29,
      name: "Product 29",
      price: 320,
      quantity: 16,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 30,
      name: "Product 30",
      price: 350,
      quantity: 5,
      image: "https://via.placeholder.com/150",
    },

  ]);

  // حالة السلة
  const [cart, setCart] = useState<CartItem[]>([]);

  // وظيفة إضافة المنتج إلى السلة
  const handleAddToCart = (productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );

    const selectedProduct = products.find((product) => product.id === productId);

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
          ? { ...product, quantity: product.quantity + productToRemove.quantity }
          : product
      )
    );

    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId)
    );
  };

  // وظيفة الطباعة
  const handlePrint = () => {
    // حساب إجمالي سعر المنتجات في السلة
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    // إنشاء نص الطباعة مع تفاصيل المنتجات والإجمالي
    const cartDetails = cart
      .map((item) => `${item.name} - $${item.price} x ${item.quantity}`)
      .join("\n");
    const printContent = `Cart Items:\n${cartDetails}\n\nTotal Price: $${totalPrice}`;
  
    // فتح نافذة جديدة للطباعة
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  return (
    <div className="grid items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">Products</h1>
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
              Quantity: {product.quantity > 0 ? product.quantity : "Out of Stock"}
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

      <h1 className="text-2xl font-bold mt-10">Cart</h1>
      <div className="w-full max-w-2xl">
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <button
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Your cart is empty.</p>
        )}
      </div>

      {/* زر الطباعة */}
      {cart.length > 0 && (
        <button
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={handlePrint}
        >
          Print Cart
        </button>
      )}
    </div>
  );
}
