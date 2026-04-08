"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import {
  ApiRequestError,
  createStudent,
  deleteStudent,
  getStats,
  getStudents
} from "@/lib/api";
import type { CreateStudentPayload, DashboardStats, Student } from "@/lib/types";

const emptyForm = {
  studentId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  score: ""
};

type FormState = typeof emptyForm;

function formatAverageScore(value: number | null) {
  if (value === null) {
    return "No scores yet";
  }

  return `${value.toFixed(1)} average`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the backend.";
}

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ count: 0, averageScore: null });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoadError(null);
    setIsLoading(true);

    try {
      const [nextStudents, nextStats] = await Promise.all([getStudents(), getStats()]);
      setStudents(nextStudents);
      setStats(nextStats);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function buildPayload(): CreateStudentPayload {
    return {
      studentId: Number(form.studentId),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || null,
      lastName: form.lastName.trim(),
      score: Number(form.score)
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setNotice(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await createStudent(buildPayload());
      setForm(emptyForm);
      setNotice("Student added to the roster.");
      await loadDashboard();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        setFieldErrors(error.fields);
      }

      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    setNotice(null);
    setLoadError(null);
    setDeletingId(id);

    try {
      await deleteStudent(id);
      setNotice(`Removed student record #${id}.`);
      await loadDashboard();
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Project 2</p>
          <h1>Course Management Console</h1>
          <p className="hero-text">
            A Next.js client for the Spring Boot roster API. Create students,
            review the current roster, and keep an eye on summary stats without
            leaving the page.
          </p>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span className="stat-label">Roster size</span>
            <strong>{stats.count}</strong>
            <p>Live count from the backend.</p>
          </article>

          <article className="stat-card">
            <span className="stat-label">Scores</span>
            <strong>
              {stats.averageScore === null ? "—" : stats.averageScore.toFixed(1)}
            </strong>
            <p>{formatAverageScore(stats.averageScore)}</p>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Create</p>
              <h2>Add a student</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => void loadDashboard()}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>
            <label>
              Student ID
              <input
                type="number"
                min="1"
                max="10"
                value={form.studentId}
                onChange={(event) => updateField("studentId", event.target.value)}
                required
              />
              {fieldErrors.studentId ? (
                <span className="field-error">{fieldErrors.studentId}</span>
              ) : null}
            </label>

            <label>
              First name
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                required
              />
              {fieldErrors.firstName ? (
                <span className="field-error">{fieldErrors.firstName}</span>
              ) : null}
            </label>

            <label>
              Middle name
              <input
                type="text"
                value={form.middleName}
                onChange={(event) => updateField("middleName", event.target.value)}
              />
              {fieldErrors.middleName ? (
                <span className="field-error">{fieldErrors.middleName}</span>
              ) : null}
            </label>

            <label>
              Last name
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                required
              />
              {fieldErrors.lastName ? (
                <span className="field-error">{fieldErrors.lastName}</span>
              ) : null}
            </label>

            <label>
              Score
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.score}
                onChange={(event) => updateField("score", event.target.value)}
                required
              />
              {fieldErrors.score ? (
                <span className="field-error">{fieldErrors.score}</span>
              ) : null}
            </label>

            {submitError ? <p className="status error">{submitError}</p> : null}
            {notice ? <p className="status success">{notice}</p> : null}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create student"}
            </button>
          </form>
        </section>

        <section className="panel roster-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Roster</p>
              <h2>Student records</h2>
            </div>
            <span className="pill">
              {isLoading ? "Syncing..." : `${students.length} loaded`}
            </span>
          </div>

          {loadError ? <p className="status error">{loadError}</p> : null}

          {isLoading ? (
            <div className="roster-empty">Loading current records from the API...</div>
          ) : students.length === 0 ? (
            <div className="roster-empty">
              No students have been added yet. Use the form to create the first one.
            </div>
          ) : (
            <div className="student-grid">
              {students.map((student) => (
                <article className="student-card" key={student.id}>
                  <div className="student-card-header">
                    <div>
                      <p className="student-name">
                        {student.firstName}{" "}
                        {student.middleName ? `${student.middleName} ` : ""}
                        {student.lastName}
                      </p>
                      <p className="student-meta">
                        Student ID {student.studentId} · Database ID {student.id}
                      </p>
                    </div>

                    <span className="score-badge">{student.score.toFixed(1)}</span>
                  </div>

                  <button
                    className="ghost-button danger-button"
                    type="button"
                    onClick={() => void handleDelete(student.id)}
                    disabled={deletingId === student.id}
                  >
                    {deletingId === student.id ? "Removing..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
