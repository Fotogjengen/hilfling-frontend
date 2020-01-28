import React, { FC, useState } from "react";
import guistyles from "hilfling-gui/lib/styles/utilities.module.css";
import Header from "../../components/Header/Header";
import Carousel from "../../components/Frontpage/Carousel/Carousel";
import CardInformationSection from "../../components/Frontpage/CardInformationSection/CardInformationSection";
import styles from "./App.module.css";
import { Footer } from "hilfling-gui/lib";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "../../utils/auth";

const App: FC<{}> = ({ auth }: any) => {
  const { authenticated } = useAuth(auth);

  const login = async () => {
    auth.login("/");
  };

  const logout = async () => {
    auth.logout("/");
  };

  return (
    <div>
      <div className={guistyles.container}>
        <Header
          authenticated={authenticated}
          login={login}
          logout={logout}
        ></Header>
        <div className={styles.contentContainer}>
          <div className={styles.leftSide}>
            <div className="slideshow">
              <Carousel></Carousel>
            </div>
            <div className="arrangements"></div>
          </div>
          <div className={styles.rightSide}>
            <CardInformationSection />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default withAuth(App);