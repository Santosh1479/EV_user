// import React, { useRef, useState } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import "remixicon/fonts/remixicon.css";
// import LocationSearchPanel from "../components/LocationSearchPanel";

// const Home = () => {
//   const [panelOpen, setPanelOpen] = useState(false);
//   const panelRef = useRef(null);

//   useGSAP(function () {
//       if (panelOpen) {
//         gsap.to(panelRef.current, {
//           height: "50%",
//           transform: "translateY(0)",
//         });
//       } else {
//         gsap.to(panelRef.current, {
//           transform: "translateY(100%)",
//         });
//       }
//     },
//     [panelOpen]
//   );

//   return (
//     <div className="relative">
//       <div className="flex justify-between h-2/7 items-center pl-4 min-w-screen bg-red-600">
//         <ul className="flex gap-4">
//           <img className="w-20 rounded-3xl" src="/icons/logo.png" alt="logo" />
//         </ul>
//       </div>
//       <div className="h-screen object-contain bg-[url(https://pbs.twimg.com/media/Gg3YpqFaMAAn58B?format=jpg&name=large)] bg-opacity-55 flex justify-center items-center">
//         <div className="float flex flex-col bg-red-600 h-2/5 w-4/5 text-white rounded-3xl text-center items-center gap-4">
//           <span className="gap-0 font-bold pt-3">
//             <p className="search">Search a Charging Station</p>
//             <p className="search">nearby!!!...</p>
//           </span>
//           <img className="w-2/5" src="/icons/location.png" alt="Location" />
//           <button
//             onClick={() => {
//               setPanelOpen(true);
//             }}
//             className="search bg-white font-bold text-3xl text-black w-3/5 h-1/5 mb-3 rounded-xl"
//           >
//             SEARCH
//           </button>
//         </div>
//       </div>
//       <div className="container text-sm mx-auto">
//         <div className="bg-black p-3 w-full flex justify-center h-3/7 text-center">
//           <p className="text-white text-sm pt-4">trademark registered</p>
//         </div>
//       </div>
//       <div
//         ref={panelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full rounded-tl-3xl border-y-2 border-black rounded-tr-3xl bg-red-600 px-3 py-3 gap-3 overflow-y-auto h-1/2"
//       >
//         <LocationSearchPanel
//           setPanelOpen={setPanelOpen}
//           setSelect={(location) => console.log('Selected location:', location)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Home;

{
  /* <div className="bg-white w-20 h-10 flex items-center justify-center rounded-xl mr-4">
  <i className="ri-battery-2-line text-2xl font-semibold"></i>
  <span className=" font-bold">{charge}%</span>
</div>; */
}

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import directly
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const panelRef = useRef(null);
  const searchButtonRef = useRef(null);
  const recognitionRef = useRef(null);
  const [charge, setCharge] = useState(null);

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "50%",
          transform: "translateY(0)",
        });
      } else {
        gsap.to(panelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [panelOpen]
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log("Decoded Token:", decodedToken); // Log the entire decoded token
          const userId = decodedToken._id; // Use _id instead of email
          console.log("User ID:", userId);
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/cars/charge?userId=${userId}`
          );
          setCharge(response.data.charge);
        }
      } catch (error) {
        console.error("Failed to fetch charge data", error);
      }
    };

    fetchUserData();
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      setMicOn(true);
    } catch (error) {
      console.error("Microphone permission denied", error);
    }
  };

  const initializeRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log(`Voice command: ${transcript}`);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };
  };

  useEffect(() => {
    requestMicrophonePermission();
    initializeRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (micOn) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [micOn]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between h-2/7 items-center pl-4 min-w-screen bg-red-600">
        <ul className="flex gap-4">
          <img className="w-20 rounded-3xl" src="/icons/logo.png" alt="logo" />
        </ul>
        {charge !== null && (
          <div className="text-white">
            <p>Charge: {charge}%</p>
          </div>
        )}
      </div>
      <div className="h-screen object-contain bg-[url(https://pbs.twimg.com/media/Gg3YpqFaMAAn58B?format=jpg&name=large)] bg-opacity-55 flex justify-center items-center">
        <div className="float flex flex-col bg-red-600 h-2/5 w-4/5 text-white rounded-3xl text-center items-center gap-4">
          <span className="gap-0 font-bold pt-3">
            <p className="search">Search a Charging Station</p>
            <p className="search">nearby!!!...</p>
          </span>
          <img className="w-2/5" src="/icons/location.png" alt="Location" />
          <button
            ref={searchButtonRef}
            onClick={() => {
              getUserLocation();
            }}
            className="search bg-white font-bold text-3xl text-black w-3/5 h-1/5 mb-3 rounded-xl"
          >
            SEARCH
          </button>
        </div>
      </div>
      <div className="container text-sm mx-auto">
        <div className="bg-black p-3 w-full flex justify-center h-3/7 text-center">
          <p className="text-white text-sm pt-4">trademark registered</p>
        </div>
      </div>
      <div
        ref={panelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full rounded-tl-3xl border-y-2 border-black rounded-tr-3xl bg-red-600 px-3 py-3 gap-3 overflow-y-auto h-1/2"
      >
        <LocationSearchPanel
          setPanelOpen={setPanelOpen}
          setSelect={(location) => console.log("Selected location:", location)}
          userLocation={userLocation}
          setMicOn={setMicOn}
        />
      </div>
    </div>
  );
};

export default Home;
