import React from "react";

const App = () => {
  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <a href="#" style={styles.navLink}>Home</a>
        <span style={styles.divider}>|</span>
        <a href="#" style={styles.navLink}>Features</a>
        <span style={styles.divider}>|</span>
        <a href="#" style={styles.navLink}>Sign In</a>
      </div>

      {/* Welcome Section */}
      <div style={styles.welcomeBox}>
        <h1 style={styles.welcomeText}>Welcome</h1>
        <h2 style={styles.welcomeText}>to</h2>
        <h1 style={styles.appName}>AI Study Assistant</h1>
      </div>

      {/* Topics */}
      <p style={styles.topics}>Time Complexity | Logic</p>

      {/* Start Button */}
      <button style={styles.button}>Start Learning</button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  navbar: {
    backgroundColor: "#E0F0FF",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#F7DF72",
  },
  navLink: {
    textDecoration: "none",
    color: "#F7DF72",
    margin: "0 5px",
  },
  divider: {
    margin: "0 5px",
    color: "#F7DF72",
  },
  welcomeBox: {
    backgroundColor: "#E0F0FF",
    padding: "40px 20px",
    marginTop: "20px",
  },
  welcomeText: {
    color: "#1F3B8C",
    margin: "5px",
  },
  appName: {
    color: "#1F3B8C",
    fontWeight: "bold",
    fontSize: "24px",
  },
  topics: {
    marginTop: "30px",
    fontWeight: "600",
    color: "#4A4A4A",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "#E0F0FF",
    border: "none",
    padding: "12px 24px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default App;

