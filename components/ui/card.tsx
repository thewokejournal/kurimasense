import { cn } from '@/lib/utils'


export function Card({ className, ...props }: any) {
return <div className={cn('bg-white', className)} {...props} />
}


export function CardContent({ className, ...props }: any) {
return <div className={cn('', className)} {...props} />
}
