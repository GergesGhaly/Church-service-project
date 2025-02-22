import { useState } from "react";

interface AddMa3rdProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fetchProducts: () => Promise<void>;
}
const AddMa3rd: React.FC<AddMa3rdProps> = ({
  setIsModalOpen,
  fetchProducts,
}) => {
  const [Ma3rdName, setMa3rdName] = useState<string>("");
  const [validFrom, setValidFrom] = useState<string>("");
  const [validTo, setValidTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const newProduct = {
      name: Ma3rdName,
      validFrom: validFrom,
      validTo: validTo,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Gallery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to add product";
        throw new Error(errorMessage);
      }

      setMessage("Product added successfully! ✅");
      setMa3rdName("");
      setValidFrom("");
      setValidTo("");

      await fetchProducts();
    } catch (err) {
      setMessage("Error adding product ❌" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">Add New Ma3rd</h2>
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
              value={Ma3rdName}
              onChange={(e) => setMa3rdName(e.target.value)}
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
              value={validFrom}
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
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMa3rd;
