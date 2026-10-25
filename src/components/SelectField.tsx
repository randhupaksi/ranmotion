import { useEffect, useRef, useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}
export interface SelectGroup {
  label: string
  options: SelectOption[]
}

interface SelectFieldProps {
  value: string
  onValueChange: (value: string) => void
  /** Accessible name. Radix renders a button, so a visible label must be repeated here. */
  label: string
  options?: SelectOption[]
  groups?: SelectGroup[]
  id?: string
  className?: string
  disabled?: boolean
  /** "sm" matches compact triggers (inline demo and lab controls) with a compact list. */
  size?: 'md' | 'sm'
  align?: 'start' | 'center' | 'end'
}

/** Radix-based dropdown that shares the RanMotion select tokens across the whole app. */
export default function SelectField({
  value,
  onValueChange,
  label,
  options = [],
  groups = [],
  id,
  className = '',
  disabled,
  size = 'md',
  align = 'start',
}: SelectFieldProps) {
  const iconSize = size === 'sm' ? 12 : 15
  const [open, setOpen] = useState(false)
  // Pressing the trigger while the list is open must close it. Radix disables pointer events
  // outside the list, so the press lands on <html> and closes the list; the click that follows
  // then reaches the trigger and re-opens it. Note when a press hit the trigger's box while the
  // list was open, and ignore the click that arrives right after it.
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closingPress = useRef(0)
  useEffect(() => {
    if (!open) return
    const onPress = (event: PointerEvent) => {
      const box = triggerRef.current?.getBoundingClientRect()
      if (
        box &&
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      )
        closingPress.current = event.timeStamp
    }
    document.addEventListener('pointerdown', onPress, true)
    return () => document.removeEventListener('pointerdown', onPress, true)
  }, [open])
  const item = (option: SelectOption) => (
    <Select.Item className="select-item" key={option.value} value={option.value}>
      <Select.ItemText>{option.label}</Select.ItemText>
      <Select.ItemIndicator className="select-indicator">
        <Check size={iconSize - 1} aria-hidden="true" />
      </Select.ItemIndicator>
    </Select.Item>
  )
  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        id={id}
        className={`select-trigger select-trigger--${size} ${className}`}
        aria-label={label}
        ref={triggerRef}
        onClick={event => {
          if (event.timeStamp - closingPress.current > 600) return
          closingPress.current = 0
          event.preventDefault()
        }}
      >
        <span className="select-value">
          <Select.Value />
        </span>
        <Select.Icon className="select-chevron" aria-hidden="true">
          <ChevronDown size={iconSize} />
        </Select.Icon>
      </Select.Trigger>
      {/* No Portal on purpose: a modal <dialog> lives in the top layer, so content portalled to
          <body> would sit outside it and be inert. Rendering in place works in both contexts. */}
      <Select.Content
        className={`select-content select-content--${size}`}
        position="popper"
        align={align}
        sideOffset={6}
        collisionPadding={12}
      >
        <Select.Viewport>
          {options.map(item)}
          {groups.map(group => (
            <Select.Group className="select-group" key={group.label}>
              <Select.Label className="select-group-label">{group.label}</Select.Label>
              {group.options.map(item)}
            </Select.Group>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  )
}
