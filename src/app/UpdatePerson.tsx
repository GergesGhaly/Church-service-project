import { useState, useEffect } from "react";
import Select from "react-select";

interface Person {
  id: string;
  name: string;
  relativeID: string;
  relativeName: string;
}

interface UpdatePersonProps {
  personId: string;
  setIsUpdateModalOpen: (isOpen: boolean) => void;
  fetchPersons: () => Promise<void>;
}

const UpdatePerson: React.FC<UpdatePersonProps> = ({
  personId,
  setIsUpdateModalOpen,
  fetchPersons,
}) => {
  const [person, setPerson] = useState<Person>({
    id: "",
    name: "",
    relativeID: "",
    relativeName: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Person[]>([]);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Customers/${personId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch person data");
        }
        const data: Person = await response.json();
        setPerson(data);
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    fetchPersonData();
  }, [personId]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Customers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data: Person[] = await response.json();
        setCustomers(data);
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    fetchCustomers();
  }, []);

  // تحديث القيم عند تغيير المدخلات
  const handleChange = (field: keyof Person, value: string) => {
    setPerson((prev) => ({ ...prev, [field]: value }));
  };

  // إرسال تحديث الشخص
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Customers/${personId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update person");
      }

      setMessage("Person updated successfully! ✅");
      await fetchPersons();
      // setIsUpdateModalOpen(false);
    } catch (err) {
      setMessage(
        "Error updating person ❌: " +
          (err instanceof Error ? err.message : "An unknown error occurred.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-lg font-bold mb-4">Update Person</h2>
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
              ID
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={person.id}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={person.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-1">
              Relative ID
            </label>
            <Select
              options={customers.map((customer) => ({
                value: customer.id,
                label: customer.name,
                id: customer.id, // الاحتفاظ بالـ ID للعرض
              }))}
              formatOptionLabel={(option) => (
                <div className="flex flex-col">
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-gray-500 text-sm">{option.id}</span>
                </div>
              )}
              isSearchable
              placeholder="Select Relative ID"
              value={
                person.relativeID
                  ? {
                      value: person.relativeID,
                      label: person.relativeName,
                      id: person.relativeID,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                selectedOption &&
                setPerson((prev) => ({
                  ...prev,
                  relativeID: selectedOption.value,
                  relativeName:
                    customers.find((c) => c.id === selectedOption.value)
                      ?.name || "",
                }))
              }
              className="text-black"
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePerson;
