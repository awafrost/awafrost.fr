import type { Metadata } from 'next';
import { MM2ValuesExplorer } from '@/components/mm2-values-explorer';

export const metadata: Metadata = {
  title: 'Valeurs MM2 et comparateur de trade | Frost',
  description: 'Recherche les valeurs des objets Murder Mystery 2 et compare les échanges.',
};

export default function MM2ValuesPage() {
  return <MM2ValuesExplorer />;
}
