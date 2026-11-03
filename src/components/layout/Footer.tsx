export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-neutral-600 sm:px-6 sm:text-left">
        <p>© {new Date().getFullYear()} 10X Shop. All rights reserved.</p>
      </div>
    </footer>
  )
}
