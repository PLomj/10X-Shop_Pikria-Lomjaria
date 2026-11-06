import { useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import type { LoginFormValues } from '../types/auth'

function hasControlCharacters(value: string) {
  return [...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
}

function isSafeDestinationPath(pathname: string) {
  if (hasControlCharacters(pathname) || /[\\?#]/.test(pathname)) return false
  if (/^\/(?:checkout|orders|profile)\/?$/i.test(pathname)) return true
  const match = /^\/orders\/([^/]+)\/?$/i.exec(pathname)
  if (!match) return false
  try {
    const reference = decodeURIComponent(match[1])
    return reference !== '.' && reference !== '..' && !hasControlCharacters(reference) &&
      !/[\\/?#]/.test(reference) && !/%[0-9a-f]{2}/i.test(reference)
  } catch {
    return false
  }
}

function getDestination(state: unknown) {
  if (typeof state !== 'object' || state === null || !('from' in state)) return '/'
  const { from } = state
  if (typeof from !== 'object' || from === null || !('pathname' in from) ||
    typeof from.pathname !== 'string' || !isSafeDestinationPath(from.pathname)) {
    return '/'
  }

  return {
    pathname: from.pathname,
    search: 'search' in from && typeof from.search === 'string' && from.search.startsWith('?') ? from.search : '',
    hash: 'hash' in from && typeof from.hash === 'string' && from.hash.startsWith('#') ? from.hash : '',
  }
}

export default function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({})
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedUsername = values.username.trim()
    const nextErrors: typeof errors = {}
    if (!trimmedUsername) nextErrors.username = 'Enter a username.'
    if (!values.password.trim()) nextErrors.password = 'Enter a password.'
    setErrors(nextErrors)

    if (nextErrors.username || nextErrors.password) {
      const firstInvalid = nextErrors.username ? usernameRef : passwordRef
      firstInvalid.current?.focus()
      return
    }

    if (!login(trimmedUsername)) {
      setErrors({ username: 'Enter a username.' })
      usernameRef.current?.focus()
      return
    }
    navigate(getDestination(location.state), { replace: true })
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="login-username" className="block font-medium">Username</label>
          <input
            ref={usernameRef}
            id="login-username"
            name="username"
            autoComplete="username"
            required
            value={values.username}
            onChange={(event) => {
              const username = event.currentTarget.value
              setValues((previous) => ({ ...previous, username }))
              if (username.trim()) setErrors((previous) => ({ ...previous, username: undefined }))
            }}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'login-username-error' : undefined}
            className="w-full rounded-md border border-neutral-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          {errors.username && <p id="login-username-error" role="alert" className="text-sm text-red-700">{errors.username}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="login-password" className="block font-medium">Password</label>
          <input
            ref={passwordRef}
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={(event) => {
              const password = event.currentTarget.value
              setValues((previous) => ({ ...previous, password }))
              if (password.trim()) setErrors((previous) => ({ ...previous, password: undefined }))
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className="w-full rounded-md border border-neutral-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          {errors.password && <p id="login-password-error" role="alert" className="text-sm text-red-700">{errors.password}</p>}
        </div>
        <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">
          Login
        </button>
      </form>
    </div>
  )
}
