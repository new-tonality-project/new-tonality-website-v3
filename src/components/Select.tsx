'use client'

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

export type SelectItem<T> = {
  value: T
  label: string
}

export type SelectProps<T> = {
  items: SelectItem<T>[]
  value: T
  onSelect: (value: T) => void
  label?: string
  placeholder?: string
  className?: string
  getItemKey?: (item: SelectItem<T>, index: number) => string | number
}

export function Select<T>({
  items,
  value,
  onSelect,
  label,
  placeholder = 'Select…',
  className,
  getItemKey,
}: SelectProps<T>) {
  const selectedItem = items.find((item) => item.value === value)

  return (
    <Listbox
      value={selectedItem ?? null}
      onChange={(item) => item && onSelect(item.value)}
      by={(a, b) => {
        if (a == null || b == null) return a === b
        return a.value === b.value
      }}
    >
      {label && (
        <Label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
          {label}
        </Label>
      )}
      <div className={`relative ${label ? 'mt-2' : ''} ${className ?? ''}`}>
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {selectedItem?.label ?? placeholder}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        >
          {items.map((item, index) => (
            <ListboxOption
              key={getItemKey?.(item, index) ?? index}
              value={item}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-indigo-500"
            >
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {item.label}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white dark:text-indigo-400">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
