'use client';

import Link from 'next/link';

export default function WelcomePage() {
  
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-8 text-center">Добро пожаловать в Менеджер Задач!</h1>
      <p className="text-xl mb-12 text-center max-w-md">
        Организуйте свои задачи эффективно и достигайте своих целей с легкостью.
      </p>
      <Link href="/login">
        <button
          className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg">
          Начать
        </button>
      </Link>
    </div>
  );
}
