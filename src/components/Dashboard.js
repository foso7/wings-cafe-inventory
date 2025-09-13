import React from "react";

function Dashboard() {
  // Products data with 5 items per category
  const products = {
    meats: [
      { id: 1, name: "Chicken Wings", price: 50, image: "/chicken.jpg" },
      { id: 2, name: "Beef Steak", price: 70, image: "/beef.jpg" },
      { id: 3, name: "Pork Ribs", price: 100, image: "/ribs.jpeg" },
      { id: 4, name: "Lamb Chops", price: 45, image: "/lamb.jpeg" },
      
    ],
    vegetables: [
      { id: 6, name: "Lettuce", price: 15, image: "/lettuce.jpg" },
      { id: 7, name: "Tomatoes", price: 3, image: "/Tomato.jpg" },
      { id: 8, name: "Carrots", price: 10, image: "/carrots.jpg" },
     
      { id: 10, name: "Cucumber", price: 14, image: "/cucumbers.webp" },
    ],
    drinks: [
      { id: 11, name: "Coca Cola", price: 14, image: "/coke.jpeg" },
      { id: 12, name: "Orange Juice", price: 19, image: "/lemon.jpg" },
      { id: 13, name: "Water Bottle", price: 11, image: "/water.webp" },
      { id: 14, name: "Sprite", price: 17, image: "/sprite.webp" },
     
    ],
  };

  // Inline styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
    },
    section: {
      marginBottom: "30px",
    },
    row: {
      display: "flex",
      gap: "40px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      width: "200px",
    },
    image: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    title: {
      margin: "10px 0",
      fontSize: "16px",
      fontWeight: "bold",
    },
    price: {
      color: "green",
      fontWeight: "bold",
    },
  };

  // Function to render each category
  const renderCategory = (title, items) => (
    <div style={styles.section}>
      <h3>{title}</h3>
      <div style={styles.row}>
        {items.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.image} alt={p.name} style={styles.image} />
            <div style={styles.title}>{p.name}</div>
            <div style={styles.price}>M{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      {renderCategory("Meats", products.meats)}
      {renderCategory("Vegetables", products.vegetables)}
      {renderCategory("Drinks", products.drinks)}
    </div>
  );
}

export default Dashboard;

