"use client";
import React, { useState, useEffect } from "react";
import AddProduct from "../../AddProduct";
import UpdateProduct from "@/app/UpdateProduct";

interface Product {
  id: number;
  imagePath: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
}

const TableComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  ); // Store selected product ID
  const [searchTerm, setSearchTerm] = useState<string>(""); // 🔹 حالة البحث
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // المنتجات بعد الفلترة

  // Fetch products
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
      setFilteredProducts(data); // تعيين المنتجات بعد التحميل
      // console.log("image path" +" "+data[3].imagePath)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 فلترة المنتجات عند البحث
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Handle remove product
  const handleRemoveProduct = async (id: number) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");

    if (!isConfirmed) return; // إلغاء العملية إذا لم يؤكد المستخدم

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Material/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      // setError("تم الحذف بنجاح ✅");
    } catch (err) {
      setError(
        "خطأ أثناء الحذف ❌: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  // Handle update button click
  const handleUpdateClick = (id: number) => {
    setSelectedProductId(id); // Set the selected product ID
    setIsUpdateModalOpen(true); // Open the update modal
  };

  // const formatImagePath = (path: string) => {
  //   if (path.startsWith("F:/")) {
  //     return path.replace("F:/Front-End/works/kamal/M3rd-main1/M3rd-main", "http://localhost:3000");
  //   }
  //   return path;
  // };

  return (
    <div className="flex flex-col py-2">
      <div className="p-4 flex justify-between items-center">
        <h2>Products </h2>
        {/* 🔹 حقل البحث */}
        <input
          type="text"
          placeholder="ابحث عن المنتج..."
          className="px-4 py-2 border rounded-lg w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Add new
        </button>

        {isModalOpen && (
          <AddProduct
            setIsModalOpen={setIsModalOpen}
            fetchProducts={fetchProducts}
          />
        )}
        {isUpdateModalOpen && selectedProductId && (
          <UpdateProduct
            productId={selectedProductId}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            fetchProducts={fetchProducts}
          />
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading && (
          <div className="flex justify-center py-4">
            <span className="text-xl text-blue-500">Loading...</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-4">
            <span className="text-xl text-red-500">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-16 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Product
                </th>
                <th scope="col" className="px-6 py-3">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3">
                  Buy Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Sell Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">
                    {/* <img src={formatImagePath(product.imagePath)} alt="Product Image" /> */}

                    <img
                      src={product.imagePath}
                      className="w-16 md:w-32 max-w-full max-h-full"
                      alt={product.name}
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      product.buyPrice === 0
                        ? "text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {product.buyPrice === 0 ? (
                      <a
                        href="/admin/priceList"
                        className="text-red-500 underline"
                      >
                        اضف سعر صالح
                      </a>
                    ) : (
                      `$${product.buyPrice}`
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      product.sellPrice === 0
                        ? "text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {product.sellPrice === 0 ? (
                      <a
                        href="/admin/priceList"
                        className="text-red-500 underline"
                      >
                        اضف سعر صالح
                      </a>
                    ) : (
                      `$${product.sellPrice}`
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="p-2 font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
                      onClick={() => handleUpdateClick(product.id)} // Pass product ID to modal
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TableComponent;
