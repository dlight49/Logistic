# Mobile-First Refactoring Patterns

## Card-Based Layouts (Replacing Tables)
When a table has too many columns for mobile, convert it to a card list for screens below `md`.

```tsx
<div className="divide-y divide-white/5">
  {/* Desktop Header */}
  <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-black/20 ...">
    <div>Column 1</div>
    ...
  </div>

  {/* Rows */}
  {items.map((item) => (
    <div key={item.id} className="p-4 md:px-8 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center ...">
      {/* Mobile Card Layout */}
      <div className="flex items-center justify-between md:hidden mb-2">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</span>
         <StatusBadge status={item.status} />
      </div>

      <div className="flex items-start gap-3 col-span-3">
         {/* Main Item Info */}
      </div>

      <div className="md:col-span-3">
         {/* Secondary Info */}
      </div>

      {/* Action Buttons - Mobile Bottom Bar or Flex End */}
      <div className="flex items-center gap-2 mt-2 md:mt-0 md:justify-end md:col-span-2">
         <button className="w-full md:w-auto ...">View</button>
      </div>
    </div>
  ))}
</div>
```

## Responsive Grids
Always use `grid-cols-1` as default and scale up.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <StatCard />
  ...
</div>
```

## Spacing and Typography
- Use `p-4 sm:p-6 lg:p-8` for container padding.
- Use `text-xs sm:text-sm` for secondary text.
- Use `h-[200px] sm:h-[300px]` for fixed-height elements like maps or charts.

## Interactive Elements
- Buttons should be at least `44x44px` (or `py-2.5 px-4`) for touch targets.
- Use `active:scale-95` for tactile feedback on mobile.
- Bottom navigation (like `AdminNav`) should account for safe areas: `pb-[calc(12px+env(safe-area-inset-bottom,0px))]`.
