import { Routes, Route, Link } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import dotenv from "dotenv";

// TODO: Add SDKs for Firebase products (Cloud Functions)
// https://firebase.google.com/docs/web/setup#available-libraries
// === Pages ===
import {
  MainLayout,
  Home2,
  Tunneling,
  // removed other pages for now
} from "./pages";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.measurementId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
          {/*<Route path="/wavefunction" element={<Wavefunction />} />}
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
