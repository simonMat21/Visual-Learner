import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link className={styles.logo} href="/">
          <span>⚑</span>
          <span className={styles.logoText}>Visual Learner</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
