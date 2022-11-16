import { Routes, Route, Link } from "react-router-dom";
// === Pages ===
import {
  MainLayout,
  Home2,
  Wavefunction,
  Tunneling,
  Interference,
} from "./pages";

// ========================================================
// ========= App ==========================================
// ========================================================
export default function App() {
  // ========= return =========
  return (
    <div>
      {/* ==============  Routes ============== */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home2 />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/tunneling" element={<Tunneling />} />
          <Route path="/wavefunction" element={<Wavefunction />} />
          <Route path="/interference" element={<Interference />} />
          {/* <Route path="/spin" element={<Spin />} /> */}
          {/* <Route path="/potential-barriers" element={<PotentialBarriers />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

// ========================================================
// ========= Pages ========================================
// ========================================================
function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
