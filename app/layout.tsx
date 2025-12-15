import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
	title: 'KurimaSense',
	description: 'Satellite-powered farming intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-gradient-to-br from-[#0b1f17] via-[#0f2f23] to-[#0b1f17] text-slate-100 font-sans antialiased">
				<div className="min-h-screen flex flex-col">
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	)
}