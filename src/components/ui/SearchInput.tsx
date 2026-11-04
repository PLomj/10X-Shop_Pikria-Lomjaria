interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <label className="block w-full max-w-md space-y-2">
      <span className="block font-medium">Search products</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-neutral-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      />
    </label>
  )
}
