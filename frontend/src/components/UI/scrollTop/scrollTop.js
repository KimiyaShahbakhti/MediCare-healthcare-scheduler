import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./scrollTop.css";
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const scrolltop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div onClick={scrolltop} className="scroll">
      <i className=" fa fa-arrow-circle-up" aria-hidden="true"></i>
    </div>
  );
}
