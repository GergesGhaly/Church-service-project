"use client";
import AddPerson from "@/app/AddPerson";
import UpdatePerson from "@/app/UpdatePerson";
import React, { useState, useEffect } from "react";
// import AddPerson from "../AddPerson";

interface Person {
    id: string,
    name: string,
    relativeID: string,
    relativeName: string
}

const TableComponent = () => {
  const [Persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // حالة التحكم بالنافذة
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  


  const fetchPersons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Customers`);
      if (!response.ok) {
        throw new Error("Failed to fetch Persons");
      }
      const data: Person[] = await response.json();
      setPersons(data);
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
  // جلب البيانات من API
  useEffect(() => {
   

    fetchPersons();
  }, []);


  const filteredPersons = Persons.filter((Person) =>
    Person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle remove Person
  const handleRemovePerson = async (personsId: string) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا الشخص؟");
  
    if (!isConfirmed) return; // إلغاء العملية إذا لم يؤكد المستخدم
  
    try {
      // إرسال طلب حذف للـ API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Customers/${personsId}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete Person");
      }
  
      await fetchPersons();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  };
    

  const handleUpdateClick = (id: string) => {
    setSelectedPersonId(id); // Set the selected product ID
    setIsUpdateModalOpen(true); // Open the update modal
  };
  
  return (
    <div className="flex flex-col py-2">
      <div className="p-4 flex justify-between items-center">
      <h2>persons</h2>
      <input
          type="text"
          placeholder="Search by Person Name..."
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
          <AddPerson setIsModalOpen={setIsModalOpen} fetchPersons={fetchPersons}/>
      )}
       {isUpdateModalOpen && selectedPersonId && (
          <UpdatePerson
          personId={selectedPersonId}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          fetchPersons={fetchPersons}
        />
       )}
      
      </div>
       
    
    
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading && (
          <div className="flex justify-center py-4">
            <span className="text-xl text-blue-500">Loading...</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-4">
            <span className="text-xl text-red-500">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">ID</span>
                </th>
              
                <th scope="col" className="px-6 py-3">
                Name
                </th>
                <th scope="col" className="px-6 py-3">
                Relative Name
                </th>
                <th scope="col" className="px-6 py-3">
                Relative ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPersons.map((Person) => (
                <tr
                  key={Person.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="p-4">{Person.id}</td>
                 
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {Person.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {Person.relativeName}
                  </td>
            
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {Person.relativeID}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => handleRemovePerson(Person.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="p-2 font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
                      onClick={() => handleUpdateClick(Person.id)} // Pass product ID to modal
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
