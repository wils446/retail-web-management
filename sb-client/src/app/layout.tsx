import { ClientRootLayout } from "./client-root-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return <ClientRootLayout>{children}</ClientRootLayout>;
}
