"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { User, AdminUser, AddUserForm } from "@/types";
import AddUserModal from "@/components/AddUserModal";
import {
  ShieldCheck,
  Plus,
  Users,
  Loader2,
  UserCog,
  Trash2,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isInitialized } = useAuthStore();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AddUserForm>({
    email: "",
    password: "",
    role: "USER",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  useEffect(() => {
    if (!isInitialized) return;

    if (!token || user?.role !== "ADMIN") {
      router.push("/books");
    }
  }, [isInitialized, token, user, router]);

  const fetchUsers = useCallback(async () => {
    if (!token || user?.role !== "ADMIN") return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AdminUser[]>("/api/admin/users", {
        auth: true,
      });
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.email.trim() || !form.password.trim()) {
      setFormError("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    setFormLoading(true);
    try {
      const newUser = await apiFetch<AdminUser>("/api/admin/users", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      });
      setUsers((prev) => [newUser, ...prev]);
      setFormSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setForm({ email: "", password: "", role: "USER" });
        setFormSuccess(false);
      }, 1200);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create user.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleteLoading(id);
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        auth: true,
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ email: "", password: "", role: "USER" });
    setFormError(null);
    setFormSuccess(false);
  };

  const inputClass =
    "w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  if (!isInitialized || user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 size={32} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          id="open-add-user-modal"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Add User
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: users.length,
            icon: Users,
            color: "text-indigo-400",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "ADMIN").length,
            icon: ShieldCheck,
            color: "text-amber-400",
          },
          {
            label: "Regular Users",
            value: users.filter((u) => u.role === "USER").length,
            icon: UserCog,
            color: "text-slate-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-slate-800/60 border border-white/10 rounded-2xl px-5 py-4"
          >
            <div
              className={`flex items-center gap-2 text-xs font-medium mb-1 ${color}`}
            >
              <Icon size={13} /> {label}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/40 border border-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Email</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2 hidden sm:block">ID</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {users.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-500">
              No users found.
            </div>
          ) : (
            users.map((u, idx) => (
              <div
                key={u.id ? `user-${u.id}` : `fallback-${idx}`}
                id={`admin-user-row-${u.id}`}
                className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <div className="col-span-1 text-slate-500 text-sm">
                  {idx + 1}
                </div>
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-medium text-white shadow-inner">
                    {u.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="text-sm text-white truncate">{u.email}</span>
                  {u.id === user?.id && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
                      You
                    </span>
                  )}
                </div>
                <div className="col-span-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      u.role === "ADMIN"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-slate-700/60 text-slate-400 border-slate-600"
                    }`}
                  >
                    {u.role === "ADMIN" ? (
                      <ShieldCheck size={11} />
                    ) : (
                      <UserCog size={11} />
                    )}
                    {u.role}
                  </span>
                </div>
                <div className="col-span-2 text-slate-600 text-xs hidden sm:block">
                  {u.id}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    disabled={deleteLoading === u.id || u.id === user?.id}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      u.id === user?.id
                        ? "You cannot delete yourself"
                        : "Delete user"
                    }
                  >
                    {deleteLoading === u.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <AddUserModal
        isOpen={modalOpen}
        onClose={closeModal}
        form={form}
        setForm={setForm}
        onSubmit={handleAddUser}
        formError={formError}
        formLoading={formLoading}
        formSuccess={formSuccess}
      />
    </div>
  );
}
