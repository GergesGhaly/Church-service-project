"use client";
import React, { useState, useEffect } from "react";
import AddPriceList from "@/app/AddPriceList";
import UpdatePriceList from "@/app/UpdatePriceList";

interface Product {
  id: number;
  materialID: number;
  materialName: string;
  validFrom: string;
  validTo: string;
  buyPrice: number;
  sellPrice: number;
}

const TableComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  ); // Store selected product ID

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/PriceList`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: Product[] = await response.json();
      setProducts(data);
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

  // Handle remove product
  const handleRemoveProduct = async (id: number) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
  
    if (!isConfirmed) return; // إلغاء العملية إذا لم يؤكد المستخدم
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/PriceList/${id}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete PriceList");
      }
  
      fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  };
  

  // Handle update button click
  const handleUpdateClick = (id: number) => {
    setSelectedProductId(id); // Set the selected product ID
    setIsUpdateModalOpen(true); // Open the update modal
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const filteredProducts = products.filter((product) =>
    product.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col py-2">
      <div className="p-4 flex justify-between items-center">
        <h2>Price List </h2>
        <input
          type="text"
          placeholder="Search by Material Name..."
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
      </div>
      {isModalOpen && (
        <AddPriceList
          setIsModalOpen={setIsModalOpen}
          fetchProducts={fetchProducts}
        />
      )}
      {isUpdateModalOpen && selectedProductId && (
        <UpdatePriceList
          id={selectedProductId}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          fetchProducts={fetchProducts}
        />
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading && (
          <div className="flex justify-center py-4 text-xl text-blue-500">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex justify-center py-4 text-xl text-red-500">
            {error}
          </div>
        )}
        {!loading && !error && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Material Name</th>
                <th className="px-6 py-3">Valid From</th>
                <th className="px-6 py-3">Valid To</th>
                <th className="px-6 py-3">Sell Price</th>
                <th className="px-6 py-3">Buy Price</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                // استخدام الدالة للتحقق مما إذا كان التاريخ الأول أكبر أو يساوي التاريخ الثاني:
                // const isEffective =
                //   compareDatesWithoutTime(product.effectiveDate, new Date()) >=
                //   0;

                // console.log(
                //   "isEffective?" +
                //     isEffective +
                //     ": " +
                //     product.effectiveDate +
                //     new Date()
                // );

                return (
                  <tr
                    key={product.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="p-4">{product.id}</td>
                    <td className="p-4">{product.materialName}</td>
                    <td
                      className="px-6 py-4 font-semibold
                     dark:text-white"
                    >
                      {formatDate(product.validFrom)}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        new Date() >= new Date(product.validFrom) &&
                        new Date() <= new Date(product.validTo)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatDate(product.validTo)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      ${product.buyPrice}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      ${product.sellPrice}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-2 font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleUpdateClick(product.id)}
                        className="p-2 font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TableComponent;
