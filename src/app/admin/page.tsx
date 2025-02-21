"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // بيانات تسجيل الدخول الصحيحة (يمكنك تعديلها)
    const correctName = "admin";
    const correctPassword = "123456";

    if (name === correctName && password === correctPassword) {
      router.push("/admin/adminOption"); // التوجيه عند نجاح تسجيل الدخول
    } else {
      setError("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
        
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">اسم المستخدم</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              placeholder="أدخل اسم المستخدم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
