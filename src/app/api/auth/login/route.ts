import { NextRequest, NextResponse } from 'next/server';

const users = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'user@example.com', password: 'password' },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email и пароль обязательны' }, { status: 400 });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: 'Неверный пароль' }, { status: 401 });
    }

    //TODO:Сделать хотя бы моковый JWT
    return NextResponse.json({ message: 'Вход выполнен успешно', email: user.email }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}