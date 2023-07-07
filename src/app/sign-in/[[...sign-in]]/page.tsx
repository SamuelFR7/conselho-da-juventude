import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <SignIn />
    </div>
  )
}
