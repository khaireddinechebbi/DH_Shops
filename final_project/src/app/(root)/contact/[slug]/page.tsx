"use client";
import { Navbar } from "@/components";
import { useEffect, useState } from "react";
import styles from './ContactUs.module.css'; // Updated import for CSS module

export default function ContactUs() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <Navbar />
      <form className={`${styles.container} ${loaded ? styles.fadeIn : ""}`}>
        <h1 className={styles.title}>Get in touch</h1>
        <div className={styles.block}>
          <label htmlFor="frm-email">Email</label>
          <input
            id="frm-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.block}>
          <label htmlFor="frm-phone">Phone</label>
          <input
            id="frm-phone"
            type="text"
            name="phone"
            autoComplete="tel"
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.nameBlock}>
          <div>
            <label htmlFor="frm-first">First Name</label>
            <input
              id="frm-first"
              type="text"
              name="first"
              autoComplete="given-name"
              required
              className={styles.inputField}
            />
          </div>
          <div>
            <label htmlFor="frm-last">Last Name</label>
            <input
              id="frm-last"
              type="text"
              name="last"
              autoComplete="family-name"
              required
              className={styles.inputField}
            />
          </div>
        </div>
        <div className={styles.block}>
          <label htmlFor="frm-message">Message</label>
          <textarea
            id="frm-message"
            name="message"
            className={styles.textArea}
          ></textarea>
        </div>
        <div className={styles.block}>
          <button type="submit" className={styles.button}>Submit</button>
        </div>
      </form>
    </>
  );
}
