import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import IndividualQuote from "../pages/IndividualQuote";
import BusinessQuote from "../pages/BusinessQuote";
import Loading from "../components/Loading";
import Report from "../pages/Report";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Quotes */}
        <Route path="/quote/individual" element={<IndividualQuote />} />
        <Route path="/quote/business" element={<BusinessQuote />} />

        {/* Loading screen */}
        <Route path="/loading" element={<Loading />} />

        {/* Report screen */}
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}
