// src/services/vacaciones.service.ts

export async function importarVacacionesExcelRequest(
  archivo: File,
  token?: string | null
) {
  const formData = new FormData();
  formData.append("file", archivo);

  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/importar-excel`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al importar el Excel");
  }

  return data;
}