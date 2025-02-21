import React, { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  sellPrice: number;
  quantity: number;
}

interface InvoiceProps {
  cart: CartItem[];
  customerID: string;
  selectedExhibition: string;
  selectedExhibitionId: number | null;
  customerName: string;
  handleRemoveFromCart: (productId: number) => void;
}

const InvoiceComponent: React.FC<InvoiceProps> = ({
  cart,
  customerID,
  selectedExhibition,
  handleRemoveFromCart,
  selectedExhibitionId,
  customerName,
}) => {
  const [message, setMessage] = useState<string | null>(null);

  const handlePrint = async () => {
    setMessage(null);

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
        console.log(
          "api" +
            `${process.env.NEXT_PUBLIC_API_URL}/Material/UpdateQuantity/${item.id}`
        );
        // 🔄 تحديث كمية المنتج في المخزون
        const materialResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Material/UpdateQuantity/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: item.quantity }),
          }
        );
        console.log(" update quantity" + item.quantity + " item id " + item.id);
        if (!materialResponse.ok) {
          const errorData = await materialResponse.json();
          throw new Error(errorData.message || "Failed to update Material");
        }
      }

      setMessage("تم إنشاء الفاتورة بنجاح ✅");

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
            <h1>فاتورة البيع</h1>
            <p><strong>المعرض:</strong> ${galleryName}</p>
            <p><strong>اسم العميل:</strong> ${customerName || "غير محدد"}</p>
            <p><strong>تاريخ الفاتورة:</strong> ${new Date().toLocaleDateString()}</p>
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
    <div className="w-full max-w-2xl text-center">
      <h1 className="text-2xl font-bold mt-10">Cart</h1>

      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {customerID && (
        <p className="p-2 text-lg font-semibold">
          <span className="text-gray-600">Customer:</span> {customerID}
        </p>
      )}
      {selectedExhibition && (
        <p className="p-2 text-lg font-semibold">
          <span className="text-gray-600">Exhibition:</span>{" "}
          {selectedExhibition}
        </p>
      )}
      {cart.length > 0 ? (
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
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
