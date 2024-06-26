import "./style.css";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Navigation";

export default function Landing({ children }) {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
