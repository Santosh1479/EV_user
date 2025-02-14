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

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const panelRef = useRef(null);
  const searchButtonRef = useRef(null);
  const recognitionRef = useRef(null);

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

      if (transcript.toLowerCase() === "search") {
        searchButtonRef.current.click();
      }
    };

    recognition.onspeechend = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (micOn) {
            recognitionRef.current.start();
          }
        }, 1000); // Add a delay before restarting
      }
    };

    recognition.onnomatch = () => {
      console.log("Speech not recognized");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error detected: " + event.error);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (micOn) {
            recognitionRef.current.start();
          }
        }, 1000); // Add a delay before restarting
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current && micOn) {
        setTimeout(() => {
          recognitionRef.current.start(); // Restart recognition if it stops
        }, 1000); // Add a delay before restarting
      }
    };

    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [micOn]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log(`User Location: ${location.latitude}, ${location.longitude}`);
          setUserLocation(location);
          setPanelOpen(true);
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Unable to retrieve your location. Please ensure location services are enabled.");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000, // Cache the position for 5 seconds
          timeout: 20000, // Wait up to 20 seconds for a response
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between h-2/7 items-center pl-4 min-w-screen bg-red-600">
        <ul className="flex gap-4">
          <img className="w-20 rounded-3xl" src="/icons/logo.png" alt="logo" />
        </ul>
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
          setSelect={(location) => console.log('Selected location:', location)}
          userLocation={userLocation}
          setMicOn={setMicOn}
        />
      </div>
    </div>
  );
};

export default Home;