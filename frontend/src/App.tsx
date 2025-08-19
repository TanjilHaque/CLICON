
import Navbar from './components/BarComponents/Navbar'
import OfferBar from './components/BarComponents/OfferBar'
import SearchBar from './components/BarComponents/SearchBar'
import WelcomeBar from './components/BarComponents/WelcomeBar'

const App = () => {
  return (
    <div>
      <OfferBar></OfferBar>
      <WelcomeBar></WelcomeBar>
      <SearchBar></SearchBar>
      <Navbar></Navbar>
    </div>
  )
}

export default App