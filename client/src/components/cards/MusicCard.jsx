import { useState, useRef, useEffect } from "react";

export default function MusicCard() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequencyData, setFrequencyData] = useState(new Array(20).fill(0));
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  const playlist = [
    {
      title: "Your Man",
      artist: "Saint Misty",
      audioFile: "/audio/your-man.mp3",
    },
    {
      title: "Taurus Sun",
      artist: "Saint Misty",
      audioFile: "/audio/taurus-sun.mp3",
    },
    {
      title: "Lover Girl",
      artist: "Saint Misty",
      audioFile: "/audio/lover-girl.mp3",
    },
    {
      title: "Disco Princess",
      artist: "Saint Misty",
      audioFile: "/audio/disco-princess.mp3",
    },
    {
      title: "Born Again Believer",
      artist: "Saint Misty",
      audioFile: "/audio/born-again-believer.mp3",
    },
    {
      title: "Eden",
      artist: "Saint Misty",
      audioFile: "/audio/eden.mp3",
    },
  ];

  const currentSong = playlist[currentTrack];

  // Initialize Web Audio API on first play
  const initializeAudioContext = () => {
    if (audioRef.current && !audioContextRef.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Small FFT size for 20 bars (32 frequency bins)
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
  };

  // Analyze audio and update frequency data
  useEffect(() => {
    const updateFrequencyData = () => {
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map the frequency data to 20 bars
        const bars = 20;
        const barData = [];
        const samplesPerBar = Math.floor(bufferLength / bars);

        for (let i = 0; i < bars; i++) {
          let sum = 0;
          for (let j = 0; j < samplesPerBar; j++) {
            sum += dataArray[i * samplesPerBar + j];
          }
          // Normalize to 0-100 range
          barData.push((sum / samplesPerBar / 255) * 100);
        }

        setFrequencyData(barData);
      } else if (!isPlaying) {
        // When not playing, gradually decrease to 0
        setFrequencyData(prev => prev.map(val => Math.max(0, val * 0.9)));
      }

      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    updateFrequencyData();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Initialize audio context on first play
        initializeAudioContext();

        // Resume if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        audioRef.current.play().catch(err => {
          console.log("Playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Playback failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  const handlePrevious = () => {
    const newTrack = currentTrack > 0 ? currentTrack - 1 : playlist.length - 1;
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const newTrack = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0;
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    // Auto-play next track when current one ends
    handleNext();
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #E8E8E8 0%, #B0B0B0 100%)",
        border: "3px solid #8A8A8A",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top Bar with Song Title */}
      <div
        style={{
          background: "linear-gradient(180deg, #4A4A4A 0%, #2A2A2A 100%)",
          borderRadius: "4px",
          padding: "8px 10px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #1A1A1A",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#FFF",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            fontWeight: "bold",
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {currentSong.title}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        preload="auto"
      >
        <source src={currentSong.audioFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Album Art / Visualizer Area */}
      <div
        style={{
          marginBottom: "12px",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
          borderRadius: "6px",
          padding: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "152px",
          border: "2px solid #666",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "12px",
            animation: isPlaying ? "spin 3s linear infinite" : "none",
          }}>
            💿
          </div>
          <div style={{
            color: "#999",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
          }}>
            {currentSong.artist}
          </div>
        </div>
      </div>

      {/* Controls and Equalizer Section */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {/* Left Side - Control Buttons and Volume */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "6px",
            flex: 1,
          }}
        >
          {/* Control Buttons */}
          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
            <button
              title="Previous Track"
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%)",
                border: "1px solid #666",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
              onClick={handlePrevious}
            >
              ⏮
            </button>
            <button
              title={isPlaying ? "Pause" : "Play"}
              style={{
                width: "32px",
                height: "32px",
                background: isPlaying
                  ? "linear-gradient(135deg, #B0B0B0 0%, #909090 100%)"
                  : "linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%)",
                border: "1px solid #666",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isPlaying
                  ? "inset 0 2px 4px rgba(0,0,0,0.3)"
                  : "0 2px 4px rgba(0,0,0,0.3)",
              }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              title="Next Track"
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%)",
                border: "1px solid #666",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
              onClick={handleNext}
            >
              ⏭
            </button>
          </div>

          {/* Volume Control */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "14px" }}>🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              style={{
                flex: 1,
                height: "6px",
                borderRadius: "3px",
                outline: "none",
                background: `linear-gradient(to right, #00AA00 0%, #00AA00 ${volume}%, #666 ${volume}%, #666 100%)`,
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                color: "#333",
                fontWeight: "bold",
                minWidth: "25px",
              }}
            >
              {volume}%
            </span>
          </div>
        </div>

        {/* Right Side - Equalizer Visualization */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "10px",
            background: "#000",
            borderRadius: "6px",
            flex: 1,
          }}
        >
          {frequencyData.map((value, i) => {
            // Determine color based on height percentage
            let color;
            if (value > 75) color = "#FF0000"; // Red
            else if (value > 50) color = "#FFA500"; // Orange
            else if (value > 25) color = "#FFFF00"; // Yellow
            else color = "#00FF00"; // Green

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(8, value)}%`,
                  background: color,
                  borderRadius: "1px",
                  transition: "height 0.1s ease, background 0.2s ease",
                  boxShadow: `0 0 3px ${color}`,
                }}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Playlist */}
      <div
        style={{
          fontSize: "11px",
          background: "#F8F8F8",
          border: "2px solid #AAA",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Playlist Header */}
        <div
          style={{
            background: "linear-gradient(180deg, #E0E0E0 0%, #C8C8C8 100%)",
            padding: "6px 8px",
            borderBottom: "1px solid #AAA",
            fontWeight: "bold",
            fontSize: "10px",
            color: "#333",
          }}
        >
          Song List
        </div>

        {/* Scrollable Playlist */}
        <div
          style={{
            maxHeight: "160px",
            overflowY: "auto",
            padding: "4px",
          }}
        >
          {playlist.map((track, index) => (
            <div
              key={index}
              onClick={() => setCurrentTrack(index)}
              style={{
                padding: "5px 6px",
                background: index === currentTrack ? "linear-gradient(90deg, #E8F4FF 0%, #D0E8FF 100%)" : "#FFF",
                cursor: "pointer",
                marginBottom: "2px",
                border: index === currentTrack ? "1px solid #4A90E2" : "1px solid #DDD",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "10px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (index !== currentTrack) {
                  e.currentTarget.style.background = "#F0F0F0";
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentTrack) {
                  e.currentTarget.style.background = "#FFF";
                }
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  color: index === currentTrack ? "#4A90E2" : "#999",
                  fontWeight: "bold",
                  minWidth: "12px",
                }}
              >
                {index === currentTrack ? "▶" : "♫"}
              </span>
              <span
                style={{
                  flex: 1,
                  fontWeight: index === currentTrack ? "bold" : "normal",
                  color: index === currentTrack ? "#000" : "#444",
                }}
              >
                {track.title}
              </span>
              <span style={{ fontSize: "9px", color: "#999" }}>Play</span>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: "9px",
          color: "#999",
          marginTop: "8px",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        MySpace Vibes • Y2K Aesthetic
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Custom Scrollbar for Playlist */
        div[style*="maxHeight: 160px"]::-webkit-scrollbar {
          width: 8px;
        }
        div[style*="maxHeight: 160px"]::-webkit-scrollbar-track {
          background: #E0E0E0;
          border-radius: 4px;
        }
        div[style*="maxHeight: 160px"]::-webkit-scrollbar-thumb {
          background: #AAA;
          border-radius: 4px;
        }
        div[style*="maxHeight: 160px"]::-webkit-scrollbar-thumb:hover {
          background: #888;
        }

        /* Volume Slider Styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%);
          border: 1px solid #666;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 100%);
          border: 1px solid #666;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}
