"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  ShieldStar,
  Prohibit,
  CheckCircle,
  CircleNotch,
  Coins,
  CaretDown,
  Storefront,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/account/user-avatar";
import { setUserRole, setUserBan, adjustBalance } from "@/lib/actions/admin";
import { formatTL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { UserRole, ResellerStatus } from "@/lib/supabase/types";

export interface AdminUserRow {
  id: string;
  nickname: string;
  email: string;
  role: UserRole;
  balance: number;
  avatar_path: string | null;
  joined_at: string;
  banned_at: string | null;
  reseller_status: ResellerStatus;
}

type Filter = "all" | "admin" | "reseller" | "banned";

export function UsersManager({ users }: { users: AdminUserRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === "admin" && !["admin", "owner"].includes(u.role)) return false;
      if (filter === "reseller" && u.reseller_status !== "approved") return false;
      if (filter === "banned" && !u.banned_at) return false;
      if (!q) return true;
      return (
        u.nickname.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    });
  }, [users, query, filter]);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "admin", label: "Yöneticiler" },
    { key: "reseller", label: "Bayiler" },
    { key: "banned", label: "Askıda" },
  ];

  return (
    <div className="space-y-4">
      {/* Arama + filtre */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2">
          <MagnifyingGlass size={16} className="text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim veya e-posta ara…"
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                filter === c.key
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-400">{visible.length} kullanıcı</p>

      {/* Liste */}
      <div className="divide-y divide-ink-100 rounded-2xl border border-ink-200 bg-white">
        {visible.map((u) => (
          <UserRow
            key={u.id}
            u={u}
            open={openId === u.id}
            onToggle={() => setOpenId(openId === u.id ? null : u.id)}
          />
        ))}
        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">Eşleşen kullanıcı yok.</p>
        )}
      </div>
    </div>
  );
}

const ROLE_BADGE: Record<UserRole, { label: string; cls: string }> = {
  owner: { label: "Sahip", cls: "bg-accent-50 text-accent-700" },
  admin: { label: "Admin", cls: "bg-brand-50 text-brand-700" },
  member: { label: "Üye", cls: "bg-ink-100 text-ink-500" },
};

function UserRow({
  u,
  open,
  onToggle,
}: {
  u: AdminUserRow;
  open: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [banReason, setBanReason] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function changeRole(role: UserRole) {
    setMsg(null);
    start(async () => {
      const r = await setUserRole({ userId: u.id, role });
      if (r.ok) router.refresh();
      else setMsg(r.error);
    });
  }
  function toggleBan() {
    setMsg(null);
    start(async () => {
      const r = await setUserBan({ userId: u.id, ban: !u.banned_at, reason: banReason || undefined });
      if (r.ok) router.refresh();
      else setMsg(r.error);
    });
  }
  function doAdjust(sign: 1 | -1) {
    const val = Number(amount) * sign;
    if (!val) return;
    setMsg(null);
    start(async () => {
      const r = await adjustBalance({ userId: u.id, amount: val, note: note || undefined });
      if (r.ok) {
        setAmount("");
        setNote("");
        router.refresh();
      } else setMsg(r.error);
    });
  }

  const rb = ROLE_BADGE[u.role];

  return (
    <div>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left hover:bg-ink-50">
        <UserAvatar name={u.nickname} avatarPath={u.avatar_path} size={40} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <span className="truncate">{u.nickname}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${rb.cls}`}>{rb.label}</span>
            {u.reseller_status === "approved" && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] font-bold text-success-700">
                <Storefront size={10} weight="fill" /> Bayi
              </span>
            )}
            {u.banned_at && (
              <span className="rounded-full bg-danger-50 px-1.5 py-0.5 text-[10px] font-bold text-danger-600">Askıda</span>
            )}
          </p>
          <p className="truncate text-xs text-ink-400">{u.email}</p>
        </div>
        <span className="shrink-0 text-right">
          <span className="block text-sm font-bold text-ink-900">{formatTL(u.balance)}</span>
          <span className="text-[11px] text-ink-400">bakiye</span>
        </span>
        <CaretDown size={16} className={cn("shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-ink-100 bg-ink-50/40 px-4 py-4">
          {/* Rol */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink-500">Rol</p>
            <div className="flex gap-1.5">
              {(["member", "admin", "owner"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => changeRole(r)}
                  disabled={pending || u.role === r}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                    u.role === r ? "border-brand-400 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-600 hover:bg-white",
                  )}
                >
                  {r !== "member" && <ShieldStar size={13} weight="fill" />}
                  {ROLE_BADGE[r].label}
                </button>
              ))}
            </div>
          </div>

          {/* Bakiye düzelt */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Coins size={14} weight="duotone" /> Bakiye Düzelt
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Tutar (₺)"
                disabled={pending}
                className="h-9 w-32"
              />
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Not (opsiyonel)"
                disabled={pending}
                className="h-9 w-44"
              />
              <Button onClick={() => doAdjust(1)} disabled={pending || !amount} size="sm">
                {pending ? <CircleNotch size={14} className="animate-spin" /> : "+ Ekle"}
              </Button>
              <Button onClick={() => doAdjust(-1)} disabled={pending || !amount} size="sm" variant="outline">
                − Düş
              </Button>
            </div>
          </div>

          {/* Ban */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink-500">Hesap Durumu</p>
            <div className="flex flex-wrap items-center gap-2">
              {!u.banned_at && (
                <Input
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Askıya alma sebebi"
                  disabled={pending}
                  className="h-9 w-52"
                />
              )}
              <Button
                onClick={toggleBan}
                disabled={pending}
                size="sm"
                variant={u.banned_at ? "outline" : "ghost"}
                className={u.banned_at ? "" : "text-danger-600 hover:bg-danger-50"}
              >
                {pending ? (
                  <CircleNotch size={14} className="animate-spin" />
                ) : u.banned_at ? (
                  <CheckCircle size={14} weight="fill" />
                ) : (
                  <Prohibit size={14} weight="fill" />
                )}
                {u.banned_at ? "Askıyı Kaldır" : "Askıya Al"}
              </Button>
            </div>
          </div>

          {msg && <p className="text-sm font-medium text-danger-600">{msg}</p>}
        </div>
      )}
    </div>
  );
}
