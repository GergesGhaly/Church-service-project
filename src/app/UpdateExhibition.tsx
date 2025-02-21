"use client";
import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  validFrom: string;
  validTo: string;
}

interface UpdateProductProps {
  id: number;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
  fetchProducts: () => Promise<void>;
}

const UpdateExhibition: React.FC<UpdateProductProps> = ({
  id,
  setIsUpdateModalOpen,
  fetchProducts,
}) => {
  const [, setProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [validFrom, setValidFrom] = useState<string>("");
  const [validTo, setValidTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Gallery/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Exhibition");
        }
        const data: Product = await response.json();
        setProduct(data);
        setProductName(data.name);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const updatedProduct = {
      name: productName,
      validFrom,
      validTo,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Gallery/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Exhibition");
      }

      setMessage("Exhibition updated successfully! ✅");
      await fetchProducts(); // 
      // Refresh the product list
      // setIsUpdateModalOpen(false);
    } catch (err) {
      setMessage(
        "Error updating Exhibition ❌: " +
          (err instanceof Error ? err.message : "An unknown error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">Update Exhibition</h2>
        {message && (
          <p
            className={`mb-4 text-sm ${
              message.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Valid From
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={validFrom || ""}
              onChange={(e) => setValidFrom(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Valid To
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={validTo || ""}
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExhibition;
