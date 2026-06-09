import { cookies } from 'next/headers';
import { ConnectBuilder } from "../ConnectBuilder";

export default async function BuilderPage() {
  const cookieStore = await cookies();
  const customerCode = cookieStore.get('connect_customer')?.value;

  return <ConnectBuilder customerCode={customerCode} />;
}
