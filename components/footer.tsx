export default function Footer() {
  return (
    <footer className="w-full py-6">
      <div className="container px-4 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} KurimaSense. All rights reserved.
      </div>
    </footer>
  )
}
