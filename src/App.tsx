import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./components/Test";
import ResultadoTest from "./components/ResultadoTest";
import AddPregunta from "./pages/AddPregunta";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/tema/:temaId" element={<Test />} />
        <Route path="/test/sueltas/:num" element={<Test />} />
        <Route path="/test/aleatorio/:num" element={<Test />} />
        <Route path="/test/completo" element={<Test />} />
        <Route path="/resultado" element={<ResultadoTest />} />
        <Route path="/addPregunta" element={<AddPregunta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
