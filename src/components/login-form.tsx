'use client'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import GoogleSignin from './GoogleSignin'
import { Separator } from './ui/separator'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border-none bg-transparent'>
        <CardHeader>
          <CardTitle className="text-3xl">Login to Focus</CardTitle>
          <CardDescription className='text-muted-foreground text-3xl'>Manage your time and get things done</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
         <GoogleSignin/>
        </CardContent>
        <Separator className='my-4' />
        <CardFooter className='text-muted-foreground text-xs'>
          By clicking continue, you acknowledge that you have read and agree to Focus's Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}
