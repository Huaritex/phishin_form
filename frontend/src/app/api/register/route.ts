import { NextResponse } from 'next/server';

type Registration = {
  nombre: string;
  email: string;
  universidad: string;
  carrera?: string;
  nivel_academico: string;
  motivacion: string;
  specializations?: string[];
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegistration(data: any): data is Registration {
  const required = ['nombre', 'email', 'universidad', 'nivel_academico', 'motivacion'];
  for (const field of required) {
    if (!data?.[field] || String(data[field]).trim() === '') return false;
  }
  if (!isValidEmail(data.email)) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!validateRegistration(body)) {
      return NextResponse.json({ success: false, message: 'Datos inválidos' }, { status: 400 });
    }

    const id = `reg_${Date.now()}`;
    return NextResponse.json({ success: true, message: 'Registro exitoso', id });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

