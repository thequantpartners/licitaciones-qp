import { Metadata } from 'next';
import SuperadminClient from '@/components/SuperadminClient';

export const metadata: Metadata = {
  title: 'Superadmin Console | Licitaciones QP',
  description: 'Centro de mando y aprovisionamiento ejecutivo para clientes de The Quant Partners',
  robots: 'noindex, nofollow',
};

export default function SuperadminPage() {
  return <SuperadminClient />;
}
