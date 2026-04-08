import type {
  ApiErrorPayload,
  CreateStudentPayload,
  DashboardStats,
  Student
} from "@/lib/types";

export class ApiRequestError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fields = fields;
  }
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = await parseJson<T | ApiErrorPayload>(response);

  if (!response.ok) {
    const apiError = payload as ApiErrorPayload | null;

    throw new ApiRequestError(
      response.status,
      apiError?.error ?? "The request failed.",
      apiError?.fields
    );
  }

  return payload as T;
}

async function requestVoid(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    cache: "no-store"
  });

  if (!response.ok) {
    const apiError = await parseJson<ApiErrorPayload>(response);

    throw new ApiRequestError(
      response.status,
      apiError?.error ?? "The request failed.",
      apiError?.fields
    );
  }
}

export function getStudents() {
  return request<Student[]>("/api/students");
}

type RawDashboardStats = {
  count: number;
  averageScore?: number | null;
};

export async function getStats(): Promise<DashboardStats> {
  const payload = await request<RawDashboardStats>("/api/students/stats");

  return {
    count: payload.count,
    averageScore: payload.averageScore ?? null
  };
}

export function createStudent(payload: CreateStudentPayload) {
  return request<Student>("/api/students", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteStudent(id: number) {
  return requestVoid(`/api/students/${id}`, {
    method: "DELETE"
  });
}
