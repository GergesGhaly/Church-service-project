import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // وظيفة التعامل مع تقديم النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!name || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // تخزين البيانات في localStorage
    localStorage.setItem('user', JSON.stringify({ name, password }));

    // التوجيه إلى الصفحة الرئيسية
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
