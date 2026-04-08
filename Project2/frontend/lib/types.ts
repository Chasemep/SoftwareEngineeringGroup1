export type Student = {
  id: number;
  studentId: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  score: number;
};

export type CreateStudentPayload = {
  studentId: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  score: number;
};

export type DashboardStats = {
  count: number;
  averageScore: number | null;
};

export type ApiErrorPayload = {
  error?: string;
  fields?: Record<string, string>;
};

