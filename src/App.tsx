import { BrowserRouter, Route, Routes } from "react-router";
import Rules from "./pages/Rules";
import Start from "./pages/Start";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
