import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles["top-content"]}>
          <div className={`${styles.box} ${styles.box1}`}>
            <div className="flex justify-center items-center">
              <p className={styles.love}>
                Click on any algorithm to start your visual learning journey
              </p>
            </div>
            <div className={styles["box1-end"]}>
              <div className={styles["box1-content"]}>
                <a href="about" className={styles.foottext}>
                  About
                </a>
              </div>

              <div className={styles["box1-content"]}>
                <a href="privacy_policy" className={styles.foottext}>
                  Privacy Policy
                </a>
              </div>

              <div className="flex gap-10">
                <a href="https://instagram.com" target="_blank" rel="noopener">
                  <Image
                    src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/instagram.svg"
                    alt="icon"
                    width={35}
                    height={30.8}
                    className={styles.imgs}
                  />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener">
                  <Image
                    src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/linkedin.svg"
                    alt="icon"
                    width={35}
                    height={30.8}
                    className={styles.imgs}
                  />
                </a>
              </div>

              <div className={styles["box1-content"]}>
                <div className={styles.love}>
                  Made with Love
                  <img
                    src="/Pink_Cockatoo.gif"
                    className="h-8 ml-3 w-8 mb-2"
                    alt="parrot"
                    width={25}
                    height={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
