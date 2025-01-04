export default function EventLayout({ children, modal }) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

// Ensure modal doesn't show by default
export const metadata = {
  title: 'Event Details',
}
