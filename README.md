# ⛅ Atmos - Weather Dashboard

<p align="center">
  <i>A clean, responsive, and dynamic weather dashboard built with vanilla web technologies.</i>
</p>

## 📖 Overview

**Atmos** is a personal weather dashboard created as a milestone project to master frontend fundamentals. It fetches real-time weather data and 7-day forecasts using the Open-Meteo API, features a fully custom UI with light/dark mode support, and allows users to search and save their favorite cities seamlessly.

Building this without relying on heavy frameworks was a conscious choice to deeply understand how the DOM, asynchronous JavaScript, and browser storage truly work under the hood.

## ✨ Features

*   **Real-Time Weather & Forecasts**: Displays current temperature, humidity, wind speed, and "feels like" temperature, along with a dynamic 7-day outlook.
*   **City Search & Auto-Complete**: Search for any city worldwide using the Open-Meteo Geocoding API.
*   **Local Storage**: Saves your default city and theme preferences so the app remembers you next time.
*   **Dark/Light Mode**: Fully custom theming using CSS variables that toggle instantly.
*   **Dynamic UI (SPA-feel)**: Built completely with Vanilla JavaScript using HTML `<template>` tags for smooth navigation between Overview, Forecast, and Settings—without reloading the page.
*   **Responsive Design**: A fluid CSS Grid and Flexbox layout that adapts beautifully to desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

*   **HTML5**: Semantic markup and `<template>` tags for dynamic rendering.
*   **CSS3**: Custom properties (variables), Grid, Flexbox, and media queries for responsiveness.
*   **JavaScript (ES6+)**: Vanilla JS for DOM manipulation, Event Delegation, Asynchronous API fetching (`fetch`, `async`/`await`), and state management.
*   **APIs**:
    *   [Open-Meteo Weather API](https://open-meteo.com/)
    *   [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

## 🚀 What I Learned

Building this project was a huge step forward in my frontend journey. By tackling the logic and bugs manually, I leveled up my understanding of:

*   **Event Delegation**: Implementing a single master click listener on the main container to handle dynamically generated elements, keeping the code clean and bug-free.
*   **Asynchronous JavaScript**: Managing API calls, handling promises, and mapping JSON data to DOM elements.
*   **State & Storage**: Understanding how to persist user data across sessions using browser `localStorage` and fallback logic (`||`).
*   **Advanced DOM Manipulation**: Swapping out whole page views without reloading the browser by cloning HTML templates, and managing element IDs/Classes dynamically.
*   **Debugging**: Tracing syntax errors, handling missing elements, and keeping DOM identity consistent.

## 📂 Project Structure

```text
├── index.html   # Main HTML structure and templates
├── style.css    # Styling, layout, and dark mode variables
└── script.js    # API logic, event delegation, and UI updates
