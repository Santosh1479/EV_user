import React, { useEffect, useRef } from "react";

const Page = () => {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Function to load a script and return a promise
    const loadScript = (src, integrity, crossOrigin, referrerPolicy) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.integrity = integrity;
        script.crossOrigin = crossOrigin;
        script.referrerPolicy = referrerPolicy;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Function to initialize the map
    const initializeMap = () => {
      const L = window.L;
      if (!L) {
        console.error("Leaflet library not loaded");
        return;
      }

      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([0, 0], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      }

      // Initialize Socket.IO
      const socket = window.io();

      socket.on("connect", () => {
        console.log("Connected to server");

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const coords = position.coords;
            socket.emit("sendLocation", {
              latitude: coords.latitude,
              longitude: coords.longitude
            });
          }, (err) => {
            console.error(err);
          }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      });

      socket.on("receiveLocation", (data) => {
        const { id, latitude, longitude } = data;
        mapRef.current.setView([latitude, longitude], 1);
        if (markersRef.current[id]) {
          markersRef.current[id].setLatLng([latitude, longitude]);
        } else {
          markersRef.current[id] = L.marker([latitude, longitude]).addTo(mapRef.current);
        }
      });
    };

    // Load Leaflet and Socket.IO scripts
    const loadScripts = async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet-src.min.js",
          "sha512-3/WyQrhTdqSVmSifQS62akgtNBhZha2lS44TnoN9Jk3J01FvsKK4suVmz6t5FtccGb5iJw58GoFhBjPE5EPc8Q==",
          "anonymous",
          "no-referrer"
        );
        await loadScript(
          "https://cdn.socket.io/4.8.1/socket.io.min.js",
          "sha384-mkQ3/7FUtcGyoppY6bz/PORYoGqOl7/aSUMn2ymDOJcapfS6PHqxhRTMh1RR0Q6+",
          "anonymous",
          "no-referrer"
        );
        initializeMap();
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
        integrity="sha512-Zcn6bjR/8RZbLEpLIeOwNtzREBAJnUKESxces60Mpoj+2okopSAcSUIUOseddDm0cxnGQzxIR7vJgsLZbdLE3w=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <div id="map" style={{ height: "500px" }}></div>
    </div>
  );
};

export default Page;