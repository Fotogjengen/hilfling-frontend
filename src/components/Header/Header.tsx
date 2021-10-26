import React, { FC } from "react";
import styles from "./Header.module.css";
import { GuiHeader, GuiHeaderLink } from "../../gui-components";
import { Link } from "react-router-dom";
import Search from "../Search/Search";

// interface Props {
//   login: () => void;
//   logout: () => void;
//   authenticated: boolean | null;
// }

const HeaderComponent: FC = () => {
  return (
    <div className={styles.header}>
      <GuiHeader>
        <Link component={GuiHeaderLink} to="/photos">
          BILDER
        </Link>
        <Link component={GuiHeaderLink} to="/about">
          OM OSS
        </Link>
        <Link component={GuiHeaderLink} to="/login">
          LOGG INN
        </Link>

        <Link component={GuiHeaderLink} to="/intern/last-opp">
          LAST OPP
        </Link>
        <Search widthProp="400px" scale="1" label="Search.." />
        {/* {authenticated ? (
          <GuiHeaderLink onClick={logout}>LOGG UT</GuiHeaderLink>
        ) : (
          <GuiHeaderLink onClick={login}>LOGG INN</GuiHeaderLink>
        )} */}
      </GuiHeader>
    </div>
  );
};

export default HeaderComponent;
