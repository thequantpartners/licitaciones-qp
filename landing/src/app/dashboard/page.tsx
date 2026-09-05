import { redirect } from 'next/navigation';

export default function DashboardRedirectPage() {
  // Redirigir al tenant principal de demostración / cliente
  redirect('/portal/consorcio-medico');
}
