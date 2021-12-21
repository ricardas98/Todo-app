import "./Footer.css";
import logoDesktopWhite from "../../images/logo-desktop-white.svg";

export const Footer = () => {
  return (
    <div className="footer">
      <div className="footerContent">
        <div className="footerLeft">
          <img src={logoDesktopWhite} alt="logoDesktopWhite" className="footerLogo"></img>
        </div>
        <div className="footerRight">
          <span className="footerText">2021. Ričardas Serneckas IFF-8/1</span>
          <span className="footerText">T120B165 Saityno taikomųjų programų projektavimas</span>
        </div>
      </div>
    </div>
  );
};
