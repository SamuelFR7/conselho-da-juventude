import { SiteHeader } from '@/components/layouts/site-header'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Link href="/evento/conselho-da-juventude">Evento</Link>
      </main>
    </>
  )
}
