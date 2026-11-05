import type { ProductSortOption } from '../../types/product'
import { productSortOptions } from '../../types/product'

interface SortSelectorProps {
  value: ProductSortOption
  onChange: (value: ProductSortOption) => void
}


export default function SortSelector({ value, onChange }: SortSelectorProps) {
  function handleChange(selectedValue: string) {
    const option = productSortOptions.find((option) => option.value === selectedValue)
    if (option) onChange(option.value)
  }

  return (
    <label className="block w-full max-w-md space-y-2">
      <span className="block font-medium">Sort by</span>
      <select
        value={value}
        onChange={(event) => handleChange(event.currentTarget.value)}
        className="w-full rounded-md border border-neutral-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {productSortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}
