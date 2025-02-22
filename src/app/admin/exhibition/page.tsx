"use client";
import React, { useState, useEffect } from "react";
import AddMa3rd from "@/app/AddExhibition";
import UpdateExhibition from "@/app/UpdateExhibition";

interface Product {
  id: number;
  name: string;
  validFrom: string;
  validTo: string;
}

const TableComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // حالة التحكم بالنافذة
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  ); // Store selected product ID
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // جلب البيانات من API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Gallery`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: Product[] = await response.json();
      setProducts(data);
      setFilteredProducts(data);
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
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

// handle remove Gallery
const handleRemoveProduct = async (id: number): Promise<void> => {
  const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المعرض؟");

  if (!isConfirmed) return; // إلغاء العملية إذا لم يؤكد المستخدم

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Gallery/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    setError("تم الحذف بنجاح ✅");
    await fetchProducts(); // إعادة جلب البيانات بعد الحذف
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

  return (
    <div className="flex flex-col py-2">
      <div className="p-4 flex justify-between items-center">
        <h2>exhibition</h2>
        <input
          type="text"
          placeholder="ابحث عن معرض..."
          className="px-4 py-2 border rounded-lg w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setIsModalOpen(true)} // فتح النافذة
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Add new
        </button>
        {isModalOpen && (
          <AddMa3rd
            setIsModalOpen={setIsModalOpen}
            fetchProducts={fetchProducts}
          />
        )}
        {isUpdateModalOpen && selectedProductId && (
          <UpdateExhibition
            id={selectedProductId}
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
        {/* {error && (
          <div className="flex justify-center py-4">
            <span className="text-xl text-red-500">{error}</span>
          </div>
        )} */}
        {!loading &&  (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">ID</span>
                </th>
               
                <th scope="col" className="px-6 py-3">
                  ma3rd
                </th>
                <th scope="col" className="px-6 py-3">
                  Valid From
                </th>
                <th scope="col" className="px-6 py-3">
                  Valid To
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

                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  {/* <td className="px-6 py-4"></td> */}
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {formatDate(product.validFrom)}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      new Date(product.validTo) >= new Date()
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formatDate(product.validTo)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
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
