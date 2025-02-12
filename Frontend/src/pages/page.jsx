import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useLocation } from "react-router-dom";

const Page = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destinationLat = parseFloat(params.get("latitude"));
    const destinationLng = parseFloat(params.get("longitude"));

    console.log(`Destination: ${destinationLat}, ${destinationLng}`);

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([0, 0], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User Location: ${latitude}, ${longitude}`);
          mapRef.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude], {
              draggable: false,
            }).addTo(mapRef.current);
          }

          L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(destinationLat, destinationLng),
            ],
            routeWhileDragging: false,
          }).addTo(mapRef.current);
        },
        (err) => {
          console.error("Error getting user location:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [location]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default Page;
