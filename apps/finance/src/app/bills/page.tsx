'use client';
import { BillsContent,BillsProvider } from '../../domains/bills';

export default function BillsPage() {

  return (
    <BillsProvider>
      <BillsContent />
    </BillsProvider>
  );
}