import '../styles/globals.css'
import { useEffect } from 'react'
import { initDatabase } from '../lib/db-postgres'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize database on app start
    initDatabase()
  }, [])

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}