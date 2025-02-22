"use client";
import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  materialID: number;
  materialName: string;
  validFrom: string;
  validTo: string;
  buyPrice: number;
  sellPrice: number;
}

interface UpdateProductProps {
  id: number;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
  fetchProducts: () => Promise<void>;
}

const UpdatePriceList: React.FC<UpdateProductProps> = ({
  id,
  setIsUpdateModalOpen,
  fetchProducts,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [validFrom, setValidFrom] = useState<string>("");
  const [validTo, setValidTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/PriceList/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data: Product = await response.json();
        setProduct(data);
        setValidFrom(data.validFrom ? data.validFrom.split("T")[0] : "");
        setValidTo(data.validTo ? data.validTo.split("T")[0] : "");
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    fetchProduct();
  }, [id]);

  // تحديث المنتج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!product) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/PriceList/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...product, validFrom, validTo }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to update price list";
        throw new Error(errorMessage);
      }

      setMessage("تم تحديث التواريخ بنجاح ✅");
      await fetchProducts(); // تحديث قائمة المنتجات

      // setLoading(false);

      setIsUpdateModalOpen(false);
    } catch (err) {
      setMessage(
        "خطأ أثناء التحديث ❌: " +
          (err instanceof Error ? err.message : "An unknown error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">
          تحديث صلاحية الأسعار
        </h2>
        {message && (
          <p
            className={`mb-4 text-sm ${
              message.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {product ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                اسم المنتج
              </label>
              <p className="text-gray-300 bg-gray-800 p-2 rounded-lg">
                {product.materialName}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                سعر الشراء
              </label>
              <p className="text-gray-300 bg-gray-800 p-2 rounded-lg">
                {product.buyPrice} جنيه
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                سعر البيع
              </label>
              <p className="text-gray-300 bg-gray-800 p-2 rounded-lg">
                {product.sellPrice} جنيه
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                تاريخ البداية (Valid From)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                تاريخ الانتهاء (Valid To)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "جارٍ التحديث..." : "تحديث"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-red-500 text-center">فشل تحميل البيانات ❌</p>
        )}
      </div>
    </div>
  );
};

export default UpdatePriceList;
