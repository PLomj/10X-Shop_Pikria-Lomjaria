import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import type { LoginFormValues } from '../types/auth'

function getDestination(state: unknown) {
  if (typeof state !== 'object' || state === null || !('from' in state)) return '/'
  const { from } = state
  if (typeof from !== 'object' || from === null || !('pathname' in from) ||
    typeof from.pathname !== 'string' || !/^\/checkout\/?$/i.test(from.pathname)) {
    return '/'
  }

  return {
    pathname: from.pathname,
    search: 'search' in from && typeof from.search === 'string' && from.search.startsWith('?') ? from.search : '',
    hash: 'hash' in from && typeof from.hash === 'string' && from.hash.startsWith('#') ? from.hash : '',
  }
}

export default function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>({ username: '' })
  const [hasError, setHasError] = useState(false)
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!login(values.username)) {
      setHasError(true)
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
            id="login-username"
            name="username"
            autoComplete="username"
            required
            value={values.username}
            onChange={(event) => {
              setValues({ username: event.target.value })
              setHasError(false)
            }}
            aria-invalid={hasError}
            aria-describedby={hasError ? 'login-error' : undefined}
            className="w-full rounded-md border border-neutral-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          {hasError && <p id="login-error" role="alert" className="text-sm text-red-700">Enter a username.</p>}
        </div>
        <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">
          Login
        </button>
      </form>
    </div>
  )
}
