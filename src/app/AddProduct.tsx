import { useState } from "react";

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | "">("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");
  const [productImage, setProductImage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      name: productName,
      price: productPrice,
      quantity: productQuantity,
      image: productImage,
    };
    console.log("New Product:", newProduct);
    // يمكنك إرسال البيانات إلى API هنا
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white bg-black-500 text-lg font-bold mb-4">
          Add New Product
        </h2>
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
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.valueAsNumber || "")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter product quantity"
              value={productQuantity}
              onChange={(e) =>
                setProductQuantity(e.target.valueAsNumber || "")
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Image URL
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter image URL"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2"
              onClick={() => console.log("Modal Closed")} // استبدلها بدالة إغلاق المودال
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
