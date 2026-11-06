import { useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

interface ProfileFormState {
  observedUsername: string | null
  draft: { value: string; baseline: string } | null
  submission: { username: string; unchanged: boolean } | null
  error: string
}

export default function ProfilePage() {
  const { user, updateUsername } = useAuth()
  const username = user?.username ?? null
  const inputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProfileFormState>({
    observedUsername: username,
    draft: null,
    submission: null,
    error: '',
  })

  // Reconcile an actual username change, rather than every new user object.
  // Keeping an edited draft avoids discarding unsaved text on external changes.
  if (form.observedUsername !== username) {
    const saveConfirmed = username !== null && form.submission?.username === username
    setForm({
      observedUsername: username,
      draft: username === null || saveConfirmed ? null : form.draft,
      submission: saveConfirmed ? form.submission : null,
      error: username === null ? '' : form.error,
    })
  }

  if (username === null) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedUsername = (form.draft?.value ?? username ?? '').trim()
    if (!trimmedUsername) {
      setForm({ ...form, submission: null, error: 'Enter a username.' })
      inputRef.current?.focus()
      return
    }

    if (!updateUsername(trimmedUsername)) {
      setForm({ ...form, submission: null, error: 'Your username could not be updated. Please sign in and try again.' })
      return
    }

    const unchanged = trimmedUsername === username
    setForm({
      ...form,
      draft: unchanged ? null : { value: trimmedUsername, baseline: username ?? '' },
      submission: { username: trimmedUsername, unchanged },
      error: '',
    })
  }

  const saveConfirmed = form.submission !== null && form.submission.username === username
  const externallyChanged = form.draft !== null && form.draft.baseline !== username

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
      <p className="break-words text-neutral-700">Current username: <span className="font-semibold">{username}</span></p>
      <p id="profile-session-note" className="text-sm text-neutral-600">Changes last for this session. Refreshing the page signs you out.</p>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="profile-username" className="block font-medium">Username</label>
          <input
            ref={inputRef}
            id="profile-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={form.draft?.value ?? username}
            onChange={(event) => setForm({
              ...form,
              draft: { value: event.currentTarget.value, baseline: form.draft?.baseline ?? username },
              submission: null,
              error: '',
            })}
            aria-invalid={Boolean(form.error)}
            aria-describedby={`profile-session-note${form.error ? ' profile-username-error' : ''}${externallyChanged ? ' profile-external-change' : ''}`}
            className="w-full rounded-md border border-neutral-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-700"
          />
          {form.error && <p id="profile-username-error" role="alert" className="text-sm text-red-700">{form.error}</p>}
          {externallyChanged && <p id="profile-external-change" role="status" className="text-sm text-neutral-700">Your current username changed. Your unsaved text has been kept.</p>}
        </div>
        <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">
          Save Changes
        </button>
        <p role="status" className="text-sm text-neutral-700">
          {saveConfirmed ? (form.submission?.unchanged ? 'No changes to save.' : 'Username updated.') : ''}
        </p>
      </form>
    </div>
  )
}
