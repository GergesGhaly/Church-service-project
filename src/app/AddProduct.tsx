import { useState, useRef } from "react";

interface AddProductProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fetchProducts: () => Promise<void>;
}

const AddProduct: React.FC<AddProductProps> = ({ setIsModalOpen, fetchProducts }) => {
  const [productName, setProductName] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null); // مرجع لحقل اختيار الصورة

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("quantity", productQuantity.toString());
    if (productImage) {
      formData.append("imageFile", productImage);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Material`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setMessage("Product added successfully! ✅");
      setProductName("");
      setProductQuantity("");
      setProductImage(null);
      setPreviewURL(null);

      if (inputFileRef.current) {
        inputFileRef.current.value = ""; // حذف قيمة حقل اختيار الصورة
      }

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
        <h2 className="text-white text-lg font-bold mb-4">Add New Product</h2>
        {message && (
          <p className={`mb-4 text-sm ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">Name</label>
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
            <label className="block text-white text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter product quantity"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.valueAsNumber)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              ref={inputFileRef} // تعيين المرجع للحقل
              className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {previewURL && (
              <div className="mt-2">
                <p className="text-white text-sm">Image Preview:</p>
                <img src={previewURL} alt="Preview" className="w-24 h-24 object-cover rounded-lg border mt-1" />
              </div>
            )}
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

export default AddProduct;
