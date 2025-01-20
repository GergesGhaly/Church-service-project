import { NextResponse } from "next/server";

// تعريف نوع المنتج
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// البيانات الأولية للمنتجات
const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    quantity: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpRd2-pDu1ns5-WqsNWONoohGcQz1nPVFsjw&s",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    quantity: 10,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 30,
    name: "Product 30",
    price: 350,
    quantity: 5,
    image: "https://via.placeholder.com/150",
  },
];

// قراءة البيانات (GET)
export async function GET() {
  return NextResponse.json(products);
}

// إضافة منتج جديد (POST)
export async function POST(request: Request) {
  const body: Product = await request.json();

  // التحقق من الحقول المطلوبة
  if (!body.name || !body.price || !body.quantity || !body.image) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // تحديد الـ id الجديد بناءً على آخر منتج
  const newId = products.length ? products[products.length - 1].id + 1 : 1;

  // إنشاء المنتج الجديد
  const newProduct: Product = {
    id: newId,
    name: body.name,
    price: body.price,
    quantity: body.quantity,
    image: body.image,
  };

  // إضافة المنتج الجديد إلى قائمة المنتجات
  products.push(newProduct);

  // إرجاع المنتج الجديد
  return NextResponse.json(newProduct, { status: 201 });
}
// تحديث منتج موجود (PUT)
export async function PUT(request: Request) {
  const body: Product = await request.json();

  // التحقق من وجود ID لتحديث المنتج
  if (!body.id) {
    return NextResponse.json(
      { error: "Product ID is required for update" },
      { status: 400 }
    );
  }

  const productIndex = products.findIndex((p) => p.id === body.id);

  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // تحديث المنتج
  products[productIndex] = { ...products[productIndex], ...body };

  return NextResponse.json(products[productIndex]);
}

// حذف منتج (DELETE)
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") as string);

  // التحقق من وجود ID لحذف المنتج
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required for deletion" },
      { status: 400 }
    );
  }

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // حذف المنتج
  const deletedProduct = products.splice(productIndex, 1);

  return NextResponse.json(deletedProduct[0]);
}


// دالة PATCH لتحديث الكمية
export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") as string);
  const action = url.searchParams.get("action"); // "increment" أو "decrement"

  // التحقق من وجود ID والإجراء
  if (!id || !action) {
    return NextResponse.json(
      { error: "Product ID and action (increment/decrement) are required" },
      { status: 400 }
    );
  }

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // تنفيذ الإجراء
  if (action === "increment") {
    products[productIndex].quantity += 1;
  } else if (action === "decrement") {
    if (products[productIndex].quantity > 0) {
      products[productIndex].quantity -= 1;
    } else {
      return NextResponse.json(
        { error: "Quantity cannot be less than 0" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Invalid action. Use 'increment' or 'decrement'" },
      { status: 400 }
    );
  }

  return NextResponse.json(products[productIndex]);
}