import { useState, useEffect } from "react";
import Select from "react-select";

interface Material {
  id: number;
  name: string;
}

interface AddPriceListProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fetchProducts: () => Promise<void>;
}

const AddPriceList: React.FC<AddPriceListProps> = ({
  setIsModalOpen,
  fetchProducts,
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialID, setMaterialID] = useState<number | "">("");
  const [validFrom, setvalidFrom] = useState<string>("");
  const [validTo, setValidTo] = useState<string>("");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Material`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }
        const data: Material[] = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const newPriceList = {
      materialID: Number(materialID),
      validFrom: new Date(validFrom).toISOString().split("T")[0],
      validTo: new Date(validTo).toISOString().split("T")[0],
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/PriceList`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPriceList),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          "Failed to add price list";
        throw new Error(errorMessage);
      }

      setMessage("Price list added successfully! ✅");
      setMaterialID("");
      setvalidFrom("");
      setBuyPrice("");
      setSellPrice("");

      await fetchProducts();
    } catch (err) {
      setMessage("Error adding price list ❌ " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">
          Add New Price List
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Material
            </label>
            <div className="mb-4">
           
              <Select
                options={materials.map((material) => ({
                  value: material.id,
                  label: material.name,
                  id: material.id,
                }))}
                formatOptionLabel={(option) => (
                  <div className="flex flex-col">
                    <span className="font-semibold">{option.label}</span>
                    {/* <span className="text-gray-500 text-sm">{option.id}</span> */}
                  </div>
                )}
                isSearchable
                placeholder="Search and Select Material"
                onChange={(selectedOption) =>
                  setMaterialID(selectedOption?.value || "")
                }
                className="text-black"
              />
            </div>{" "}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              valid From
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={validFrom}
              onChange={(e) => setvalidFrom(e.target.value)}
              required
            />
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
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Buy Price
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter buy price"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.valueAsNumber || "")}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Sell Price
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter sell price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.valueAsNumber || "")}
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

export default AddPriceList;
