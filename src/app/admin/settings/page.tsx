'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Could not update password' })
        setLoading(false)
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage({ type: 'success', text: 'Password updated successfully.' })
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-zinc-400">Manage your admin account</p>

      <div className="mt-10 max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="text-lg font-semibold text-white">Change password</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Use a strong password you don&apos;t use elsewhere.
        </p>

        {message ? (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : 'border-red-500/40 bg-red-500/10 text-red-400'
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="current" className="mb-2 block text-sm text-zinc-400">
              Current password
            </label>
            <input
              id="current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="new" className="mb-2 block text-sm text-zinc-400">
              New password
            </label>
            <input
              id="new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-2 block text-sm text-zinc-400">
              Confirm new password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
