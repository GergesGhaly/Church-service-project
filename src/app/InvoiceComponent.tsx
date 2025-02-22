import React, { useEffect, useState } from "react";
import Select from "react-select";

interface CartItem {
  id: number;
  name: string;
  sellPrice: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
}

interface Exhibition {
  id: number;
  name: string;
}

interface InvoiceProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleRemoveFromCart: (productId: number) => void;
}

const InvoiceComponent: React.FC<InvoiceProps> = ({
  cart,
  setCart,
  handleRemoveFromCart,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedExhibition, setSelectedExhibition] = useState<string>("");
  const [selectedExhibitionId, setSelectedExhibitionID] = useState<
    number | null
  >(null);
  // const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const [, setLoading] = useState<boolean>(true);
  // const [, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerID, setCustomerID] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  // const [headrId, setHeadrId] = useState<string>("");

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

  const fetchExhibition = async () => {
    try {
        setLoading(true);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Gallery/GetValiedGalleries`
        );

        if (!response.ok) {
            const errorData = await response.json(); // قراءة رسالة الخطأ من الباك إند
            throw new Error(errorData.message || "Failed to fetch Exhibition");
        }

        const data: Exhibition[] = await response.json();
        if (data.length > 0) {
            setSelectedExhibition(data[0].name);
            setSelectedExhibitionID(data[0].id);
        } else {
            setMessage("❌ لا يوجد معارض صالحة حالياً.");
        }

    } catch (err: unknown) {
        if (err instanceof Error) {
            setMessage(`❌ خطأ: ${err.message}  `); // عرض رسالة الخطأ القادمة من الباك إند
        } else {
            setMessage("❌ خطأ غير معروف أثناء جلب المعارض.");
        }
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchCustomers();
    fetchExhibition();
  }, []);

  const handlePrint = async () => {
    setMessage(null);

    // ✅ التحقق من الحقول المطلوبة قبل الإرسال
    if (!customerID) {
      setMessage("❌ يرجى اختيار اسم العميل قبل إنشاء الفاتورة.");
      return;
    }

    if (!selectedExhibitionId) {
      setMessage("❌ يرجى اختيار المعرض قبل إنشاء الفاتورة.");
      return;
    }

    try {
      // 🧾 إرسال بيانات الـ Bill Header
      const billHeader = {
        customerID: customerID,
        galleryID: selectedExhibitionId,
        billingDate: new Date().toISOString(),
        totalAmount: cart.reduce(
          (total, item) => total + item.sellPrice * item.quantity,
          0
        ),
      };

      const headerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/BillHeader`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(billHeader),
        }
      );

      if (!headerResponse.ok) {
        const errorData = await headerResponse.json();
        throw new Error(errorData.message || "Failed to create Bill Header");
      }

      const headerData = await headerResponse.json();
      const billHeaderID = headerData.id;
      // setHeadrId(headerData.id);

      // 📦 إرسال بيانات المنتجات (Bill Items) وتحديث المخزون
      for (const item of cart) {
        const billItem = {
          billHeaderID,
          materialID: item.id,
          quantity: item.quantity,
          sellPrice: item.sellPrice,
        };

        // 📨 إرسال Bill Item
        const itemResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/BillItems`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(billItem),
          }
        );

        if (!itemResponse.ok) {
          const errorData = await itemResponse.json();
          throw new Error(errorData.message || "Failed to add Bill Item");
        }
        // 🔄 تحديث كمية المنتج في المخزون
        const materialResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Material/UpdateQuantity/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: item.quantity }),
          }
        );
        // console.log(" update quantity" + item.quantity + " item id " + item.id);
        if (!materialResponse.ok) {
          const errorData = await materialResponse.json();
          throw new Error(errorData.message || "Failed to update Material");
        }
      }

      setMessage("تم إنشاء الفاتورة بنجاح ✅");
      setCustomerName("");
      setCustomerID("");
      setCart([]);

      // 🖨️ طباعة الفاتورة بعد النجاح
      if (typeof window === "undefined") return;

      const galleryName = selectedExhibition;
      const totalPrice = cart.reduce(
        (sum, item) => sum + item.sellPrice * item.quantity,
        0
      );
      const cartDetails = cart
        .map((item) => `${item.name} - $${item.sellPrice} x ${item.quantity}`)
        .join("\n");

      const printContent = `
            <h1>فاتورة ${billHeaderID}</h1>
            <p><strong>المعرض:</strong> ${galleryName}</p>
            <p><strong>اسم العميل:</strong> ${customerName || "غير محدد"}</p>
            <p><strong>تاريخ الفاتورة:</strong> ${new Date().toLocaleDateString(
              "ar-EG",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            )}</p>

            <hr>
            <h2>تفاصيل المنتجات:</h2>
            <pre>${cartDetails}</pre>
            <hr>
            <p><strong>الإجمالي:</strong> $${totalPrice}</p>
        `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
                <html>
                    <head>
                        <title>طباعة الفاتورة</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1, h2 { color: #333; }
                            pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                        </style>
                    </head>
                    <body>${printContent}</body>
                </html>
            `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ خطأ أثناء إنشاء الفاتورة: ${err.message}`);
      } else {
        setMessage("❌ خطأ غير معروف أثناء إنشاء الفاتورة");
      }
    }
  };

  return (
    <div className="w-full  text-center">
      <h1 className="text-2xl font-bold p-2">Plaese select</h1>
      <div className="flex justify-center gap-4 items-center w-full">
        <Select
          options={customers?.map((customer) => ({
            value: customer.name,
            label: customer.name,
            id: customer.id,
          }))}
          formatOptionLabel={(option) => (
            <div className="flex flex-col text-right w-full ">
              <span className="font-semibold">{option.label}</span>
              <span className="text-gray-500 text-sm">{option.id}</span>
            </div>
          )}
          isSearchable
          placeholder="Search by name or ID"
          onChange={(selectedOption) => {
            setCustomerName(selectedOption?.value || "");
            setCustomerID(selectedOption?.id || "");
          }}
          className="w-full"
          classNamePrefix="select"
          filterOption={(option, inputValue) => {
            const { label, id } = option.data;
            return (
              label.toLowerCase().includes(inputValue.toLowerCase()) ||
              id.toLowerCase().includes(inputValue.toLowerCase())
            );
          }}
        />
      </div>

      <h1 className="text-2xl font-bold mt-10 p-2">Cart</h1>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {customerName && (
        <p className="p-2 text-lg font-semibold">
          <span className="text-gray-600">Customer:</span> {customerName}
        </p>
      )}
      {selectedExhibition && (
        <p className="p-2 text-lg font-semibold">
          <span className="text-gray-600">المعرض:</span> {selectedExhibition}
        </p>
      )}
      {cart.length > 0 ? (
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm flex gap-2 justify-between items-center "
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">Price: ${item.sellPrice}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => handleRemoveFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
            onClick={handlePrint}
          >
            Print Invoice
          </button>
        </div>
      ) : (
        <p>Your invoice is empty.</p>
      )}
    </div>
  );
};

export default InvoiceComponent;
