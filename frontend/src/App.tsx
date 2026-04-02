import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Discover } from "./pages/Discover";
import { Onboarding } from "./pages/Onboarding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen route — no nav layout */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Layout-wrapped routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
