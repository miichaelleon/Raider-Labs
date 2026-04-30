import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function Home() {
  const { token } = useAuth();

  return (
    <>
      <Navbar isLoggedIn={!!token} />
      <Hero />
      <Footer />
    </>
  );
}