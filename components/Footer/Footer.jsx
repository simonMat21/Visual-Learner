import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles["top-line"]}></div>
        <div className={styles["top-content"]}>
          <div className={`${styles.box} ${styles.box1}`}>
            <div>
              <span className={styles["box1-span-title"]}>Algo Visualiser</span>
            </div>
            <div className={styles["box1-content"]}>
              <div>Thank you for visiting our website!</div>
              <div>
                "Prepare to embark on a captivating journey through the
                corridors of innovation."
              </div>
              <div>We warmly appreciate your visit and support.</div>
            </div>{" "}
            <div className={styles["box1-end"]}>
              <a href="https://instagram.com" target="_blank" rel="noopener">
                <Image
                  src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/instagram.svg"
                  alt="icon"
                  width={35}
                  height={30.8}
                />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener">
                <Image
                  src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/linkedin.svg"
                  alt="icon"
                  width={35}
                  height={30.8}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles["bottom-line"]}></div>
      </div>
    </footer>
  );
};

export default Footer;
