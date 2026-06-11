'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handle() {
    if (!confirm('Bronni bekor qilmoqchimisiz?')) return;
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
    if (res.ok) router.refresh();
    else { const j = await res.json(); alert(j.message || 'Xatolik'); }
    setLoading(false);
  }
  return <button onClick={handle} disabled={loading} className="btn-danger-sm">{loading ? '...' : 'Bekor'}</button>;
}
