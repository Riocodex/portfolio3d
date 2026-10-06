import About from "./About";
import Capabilities from "./Capabilities";
import Contact from "./Contact";
import Footer from "./Footer";
import Hero from "./Hero";
import Intro from "./Intro";
import Navbar from "./Navbar";
import Process from "./Process";
import SelectedWork from "./SelectedWork";
import TrackRecord from "./TrackRecord";

const Home = () => (
  <div className='min-h-screen bg-paper text-ink'>
    <a href='#main' className='skip-link'>
      Skip to content
    </a>
    <Navbar />
    <main id='main'>
      <Hero />
      <Intro />
      <TrackRecord />
      <SelectedWork />
      <About />
      <Process />
      <Capabilities />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default Home;
