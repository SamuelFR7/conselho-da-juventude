import { UserProfile } from '@clerk/nextjs'

import { Shell } from '@/components/shells/shell'
import { TitleHeader } from '@/components/title-header'

export default function AccountPage() {
  return (
    <Shell>
      <TitleHeader
        title="Conta"
        description="Gerencia sua conta aqui"
        size="sm"
      />
      <div className="w-full overflow-hidden">
        <UserProfile />
      </div>
    </Shell>
  )
}
