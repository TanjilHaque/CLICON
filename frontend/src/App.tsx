import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App