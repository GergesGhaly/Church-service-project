import { useState, useEffect } from "react";
import Select from "react-select";

interface Customer {
  id: string;
  name: string;
}

interface AddPersonProps {
  setIsModalOpen: (isOpen: boolean) => void;
  fetchPersons: () => Promise<void>;
}

const AddPerson: React.FC<AddPersonProps> = ({
  setIsModalOpen,
  fetchPersons,
}) => {
  const [personName, setPersonName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [relativeId, setRelativeId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [idError, setIdError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Customers`
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id.length !== 14) {
      setIdError("ID غير صالح");
      return;
    }

    setLoading(true);
    setMessage(null);
    setIdError(null);

    const newPerson = { id, name: personName, relativeID: relativeId };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPerson),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // استخراج بيانات الخطأ من الـ API
        if (errorData.message?.includes("already exists")) {
          setIdError("هذا الـ ID مستخدم بالفعل ❌");
        } else {
          setMessage("Error adding Person ❌ " + errorData.message);
        }
        throw new Error(errorData.message || "Failed to add Person");
      }

      setMessage("Person added successfully! ✅");
      setPersonName("");
      setId("");
      setRelativeId(null);
      setIdError(null);
      fetchPersons();
      fetchCustomers();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // السماح فقط بالأرقام
      setId(value);
      setIdError(value.length === 14 ? null : "ID غير صالح");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">Add New Person</h2>
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
              Id
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter ID (14 digits)"
              value={id}
              onChange={handleIdChange}
              maxLength={14}
              required
            />
            {idError && <p className="text-red-500 text-sm">{idError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter Person name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Relative Id
            </label>
            <Select
              options={customers.map((customer) => ({
                value: customer.id,
                label: customer.name,
                id: customer.id,
              }))}
              formatOptionLabel={(option) => (
                <div className="flex flex-col">
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-gray-500 text-sm">{option.id}</span>
                </div>
              )}
              isSearchable
              placeholder="Search By Id & Select Relative ID"
              onChange={(selectedOption) =>
                setRelativeId(selectedOption?.value || null)
              }
              className="text-black"
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

export default AddPerson;
