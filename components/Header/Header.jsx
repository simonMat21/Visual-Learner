import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span>⚑</span>
          <span className={styles.logoText}>AlgoVis</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#explore" className={styles.link}>
            Explore
          </a>
          <a href="#create" className={styles.link}>
            Create
          </a>
          <a href="#teach" className={styles.link}>
            Teach
          </a>
        </nav>

        {/* Sign In Button */}
        <button className={styles.signInBtn}>Sign In</button>
      </div>
    </header>
  );
};

export default Header;
