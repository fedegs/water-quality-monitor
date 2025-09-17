import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react"
import type { ComponentProps } from "react"

type SpinnerProps = ComponentProps<typeof LoaderCircleIcon>

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircleIcon className={cn('animate-spin text-primary', className)} {...props} />
  )
}

export default Spinner