import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationSearchPanel = ({ setPanelOpen, setSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchNearestLocations = async (userLocation) => {
      try {
        console.log('Fetching nearest locations for:', userLocation);
        const { data } = await axios.get("http://localhost:3000/maps/get-nearest-locations", {
          params: {
            origin: `${userLocation.latitude},${userLocation.longitude}`,
          },
        });
        console.log('Data received:', data);
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching nearest locations:", error);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            fetchNearestLocations(userLocation);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSelect(suggestion);
    setPanelOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <i
        onClick={() => {
          setPanelOpen(false);
        }}
        className="ri-arrow-down-wide-line items-center text-4xl font-bold invert "
      ></i>
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 w-full border-2 p-3 bg-white border-slate-500 active:border-black rounded-xl items-center my-2 justify-between"
        >
          <div className="flex justify-end gap-3">
            <h2 className="h-8 flex items-center justify-center w-12 rounded-full">
              <img className="h-8 w-8" src="/icons/placeholder.png" alt="" />
            </h2>
            <h4 className="font-bold text-xl">{elem.name}</h4>
          </div>
          <div>
            <h4 className="font-semibold text-sm">
              {elem.portsAvailable} Ports Available
            </h4>
            <h4 className="font-semibold text-sm">
              Distance - {elem.distance} KMs
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;