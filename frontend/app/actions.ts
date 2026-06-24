"use server";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL environment variable is missing. Please define it in .env.local");
}

export async function getTodosAction(
  date?: string,
  filter?: string,
  search?: string
) {
  const queryParams = new URLSearchParams();
  if (date) queryParams.set("date", date);
  if (filter) queryParams.set("filter", filter);
  if (search) queryParams.set("search", search);

  const url = `${BACKEND_URL}/todos?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store", // 서버 사이드에서 실시간 데이터 로드
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch todos from backend: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getTodosAction Server Action:", error);
    throw error;
  }
}

export async function getTodoByIdAction(id: string) {
  const url = `${BACKEND_URL}/todos/${id}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch todo details from backend: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error in getTodoByIdAction Server Action for ID ${id}:`, error);
    throw error;
  }
}
