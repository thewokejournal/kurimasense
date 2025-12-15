import { cn } from '@/lib/utils'


export function Card({ className, ...props }: any) {
return (
<div
className={cn(
'rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.25)]',
className
)}
{...props}
/>
)
}