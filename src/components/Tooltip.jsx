import * as RT from '@radix-ui/react-tooltip'

export function TooltipProvider({ children }) {
  return (
    <RT.Provider delayDuration={250} skipDelayDuration={100}>
      {children}
    </RT.Provider>
  )
}

export default function Tooltip({ children, label, side = 'top', align = 'center' }) {
  if (!label) return children
  return (
    <RT.Root>
      <RT.Trigger asChild>{children}</RT.Trigger>
      <RT.Portal>
        <RT.Content
          side={side}
          align={align}
          sideOffset={8}
          className="z-50 select-none rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-slate-900/20 data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          {label}
          <RT.Arrow className="fill-slate-900" />
        </RT.Content>
      </RT.Portal>
    </RT.Root>
  )
}
