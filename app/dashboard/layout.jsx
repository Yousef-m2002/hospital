import Slidebar from '../_components/dashboard/Slidebar'
export default function Layout({ children }) {
  return (
    <div className="flex  flex-row-reverse">
      <Slidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
