import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Presentation/layout";
import Home from "./Presentation/pages/home";
import About from "./Presentation/pages/about";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
