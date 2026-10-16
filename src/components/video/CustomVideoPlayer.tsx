import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CustomVideoPlayer.css';

interface CustomVideoPlayerProps {
  src: string;
  title?: string;
  language?: 'en' | 'kn';
  onLanguageChange?: (lang: 'en' | 'kn') => void;
  expectedDuration?: number;
  initialProgress?: number;
  onProgressUpdate?: (percent: number, currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onRequirementMet?: () => void;
  onError?: () => void;
}

// YouTube style time format (e.g. "0:45 / 3:53" or "1:02:15")
function formatYouTubeTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const s = secs < 10 ? `0${secs}` : `${secs}`;

  if (hrs > 0) {
    const m = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${m}:${s}`;
  }
  return `${mins}:${s}`;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  title = 'Masterclass Video',
  language = 'en',
  onLanguageChange,
  expectedDuration = 233,
  onProgressUpdate,
  onEnded,
  onRequirementMet,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubberTrackRef = useRef<HTMLDivElement | null>(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(expectedDuration);
  const [bufferedPct, setBufferedPct] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Scrubber / Dragging State
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const scrubTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);

  // Scrubber Hover Tooltip
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPositionPct, setHoverPositionPct] = useState(0);

  // UI Visibility
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Settings Popover (YouTube Gear Menu)
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSubmenu, setSettingsSubmenu] = useState<'main' | 'speed'>('main');

  // YouTube Center Flash Animation (play / pause icon flash)
  const [centerFlash, setCenterFlash] = useState<'play' | 'pause' | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // YouTube Double-Click Ripple Animation State
  const [doubleClickSide, setDoubleClickSide] = useState<'left' | 'right' | null>(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(10);
  const rippleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<{ time: number; side: string }>({ time: 0, side: '' });

  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPercent = duration > 0 ? Math.min(100, (displayTime / duration) * 100) : 0;

  // Flash play/pause icon in center of screen
  const triggerCenterFlash = (type: 'play' | 'pause') => {
    setCenterFlash(type);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setCenterFlash(null);
    }, 450);
  };

  // Reset controls hide timeout
  const triggerActivity = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying && !showSettings && !isScrubbing) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying, showSettings, isScrubbing]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          triggerCenterFlash('play');
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerCenterFlash('pause');
    }
    triggerActivity();
  }, [triggerActivity]);

  // YouTube Double Click: Left Rewind Ripple
  const triggerRewindRipple = useCallback(() => {
    if (!videoRef.current) return;
    const step = 10;
    const target = Math.max(0, videoRef.current.currentTime - step);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    scrubTimeRef.current = target;
    setScrubTime(target);

    setDoubleClickSide('left');
    setAccumulatedSeconds((prev) => (doubleClickSide === 'left' ? prev + step : step));

    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    rippleTimerRef.current = setTimeout(() => {
      setDoubleClickSide(null);
      setAccumulatedSeconds(10);
    }, 800);

    triggerActivity();
  }, [doubleClickSide, triggerActivity]);

  // YouTube Double Click: Right Forward Ripple
  const triggerForwardRipple = useCallback(() => {
    if (!videoRef.current) return;
    const maxDur = videoRef.current.duration || duration || expectedDuration;
    const step = 10;
    const target = Math.min(maxDur, videoRef.current.currentTime + step);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    scrubTimeRef.current = target;
    setScrubTime(target);

    setDoubleClickSide('right');
    setAccumulatedSeconds((prev) => (doubleClickSide === 'right' ? prev + step : step));

    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    rippleTimerRef.current = setTimeout(() => {
      setDoubleClickSide(null);
      setAccumulatedSeconds(10);
    }, 800);

    triggerActivity();
  }, [doubleClickSide, duration, expectedDuration, triggerActivity]);

  // Dedicated YouTube Double-Click & Click Handlers
  const handleLeftDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    triggerRewindRipple();
  };

  const handleRightDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    triggerForwardRipple();
  };

  const handleCenterDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    toggleFullscreen();
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      togglePlay();
      clickTimerRef.current = null;
    }, 240);
  };

  // Mobile Touch Double-Tap
  const handleTouchTap = (side: 'left' | 'right' | 'center') => {
    const now = Date.now();
    if (now - lastTapRef.current.time < 320 && lastTapRef.current.side === side) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (side === 'left') triggerRewindRipple();
      else if (side === 'right') triggerForwardRipple();
      else toggleFullscreen();
      lastTapRef.current = { time: 0, side: '' };
    } else {
      lastTapRef.current = { time: now, side };
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        togglePlay();
        lastTapRef.current = { time: 0, side: '' };
      }, 260);
    }
    triggerActivity();
  };

  // Scrubber Hover Tooltip calculation
  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = (pos / rect.width) * 100;
    const time = (pos / rect.width) * (duration || expectedDuration);
    setHoverPositionPct(pct);
    setHoverTime(time);
  };

  const handleScrubberMouseLeave = () => {
    setHoverTime(null);
  };

  // Scrubber Drag Handlers (Smooth, Non-sticking)
  const handleScrubStart = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    wasPlayingRef.current = !videoRef.current.paused;
    videoRef.current.pause();
    setIsScrubbing(true);
    const target = parseFloat(e.currentTarget.value);
    if (!isNaN(target)) {
      scrubTimeRef.current = target;
      setScrubTime(target);
    }
  };

  const handleScrubMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (!isNaN(target)) {
      scrubTimeRef.current = target;
      setScrubTime(target);

      if (videoRef.current) {
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          videoRef.current.currentTime = target;
        } else {
          pendingSeekRef.current = target;
        }
      }
    }
  };

  const handleScrubEnd = (e?: React.SyntheticEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const valFromEvent = e && 'value' in e.currentTarget ? parseFloat(e.currentTarget.value) : NaN;
    const finalTime = !isNaN(valFromEvent) ? valFromEvent : scrubTimeRef.current;

    videoRef.current.currentTime = finalTime;
    setCurrentTime(finalTime);
    scrubTimeRef.current = finalTime;
    setScrubTime(finalTime);
    setIsScrubbing(false);
    pendingSeekRef.current = null;
    isSeekingRef.current = false;

    if (wasPlayingRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  // Direct Click on Timeline Scrubber
  const handleScrubChange = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = parseFloat((e.currentTarget as HTMLInputElement).value);
    if (!isNaN(target) && videoRef.current) {
      scrubTimeRef.current = target;
      videoRef.current.currentTime = target;
      setCurrentTime(target);
      setScrubTime(target);
      if (wasPlayingRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  // Volume & Mute Handlers
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    triggerActivity();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    setVolume(val);
    if (val === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Speed selection
  const handleSelectRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    setSettingsSubmenu('main');
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Update buffer
  const updateBuffer = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const buffered = videoRef.current.buffered;
    if (buffered.length > 0) {
      const end = buffered.end(buffered.length - 1);
      setBufferedPct(Math.min(100, (end / videoRef.current.duration) * 100));
    }
  };

  // Video Events
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    if (!isScrubbing) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      const dur = videoRef.current.duration || duration || expectedDuration;
      const pct = Math.min(100, Math.floor((cur / dur) * 100));

      if (onProgressUpdate) {
        onProgressUpdate(pct, cur, dur);
      }
      if (pct >= 90 && onRequirementMet) {
        onRequirementMet();
      }
    }
    updateBuffer();
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && !isNaN(dur) && dur > 0) {
      setDuration(dur);
    }
    updateBuffer();
  };

  const handleSeeked = () => {
    if (pendingSeekRef.current !== null && videoRef.current) {
      const next = pendingSeekRef.current;
      pendingSeekRef.current = null;
      videoRef.current.currentTime = next;
    } else {
      isSeekingRef.current = false;
    }
    setIsBuffering(false);
  };

  // Keyboard Shortcuts (Space, Arrows, M, F, J, L, K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (!containerRef.current?.contains(document.activeElement) && !containerRef.current?.matches(':hover')) {
        return;
      }

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        triggerRewindRipple();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        triggerForwardRipple();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, triggerRewindRipple, triggerForwardRipple]);

  return (
    <div
      ref={containerRef}
      className={`yt-player ${isFullscreen ? 'yt-player--fullscreen' : ''} ${
        !showControls && isPlaying ? 'yt-player--controls-hidden' : ''
      }`}
      onMouseMove={triggerActivity}
      onTouchStart={triggerActivity}
      onMouseLeave={() => {
        if (isPlaying && !showSettings) setShowControls(false);
      }}
      tabIndex={0}
      aria-label="YouTube-style AERS Video Player"
    >
      {/* Video Element - Clean, No browser default controls */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        playsInline
        preload="metadata"
        className="yt-video-element"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onPause={() => setIsPlaying(false)}
        onSeeked={handleSeeked}
        onError={() => { if (onError) onError(); }}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
      />

      {/* Interactive YouTube Double-Click & Tap Hit Zones */}
      <div className="yt-doubletap-layer">
        <div
          className="yt-doubletap-zone yt-doubletap-zone--left"
          onClick={handleZoneClick}
          onDoubleClick={handleLeftDoubleClick}
          onTouchEnd={() => handleTouchTap('left')}
          title="Double click to rewind 10s"
          aria-label="Double click to rewind 10 seconds"
        />
        <div
          className="yt-doubletap-zone yt-doubletap-zone--center"
          onClick={handleZoneClick}
          onDoubleClick={handleCenterDoubleClick}
          onTouchEnd={() => handleTouchTap('center')}
          title="Click to play/pause, double click for fullscreen"
          aria-label="Click to play or pause"
        />
        <div
          className="yt-doubletap-zone yt-doubletap-zone--right"
          onClick={handleZoneClick}
          onDoubleClick={handleRightDoubleClick}
          onTouchEnd={() => handleTouchTap('right')}
          title="Double click to forward 10s"
          aria-label="Double click to fast forward 10 seconds"
        />
      </div>

      {/* Buffering Spinner (YouTube style circular spinner) */}
      {isBuffering && (
        <div className="yt-spinner-overlay">
          <div className="yt-spinner" />
        </div>
      )}

      {/* YouTube Signature Center Play / Pause Flash Animation */}
      {centerFlash && (
        <div className="yt-center-flash" key={centerFlash + Date.now()}>
          <div className="yt-flash-circle">
            {centerFlash === 'play' ? (
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* YouTube Double-Click Left Ripple (Rewind -10s / -20s / -30s) */}
      {doubleClickSide === 'left' && (
        <div className="yt-double-click-ripple yt-ripple-left">
          <div className="yt-ripple-arc">
            <div className="yt-chevrons">
              <span className="yt-chevron yt-c1">‹</span>
              <span className="yt-chevron yt-c2">‹</span>
              <span className="yt-chevron yt-c3">‹</span>
            </div>
            <span className="yt-ripple-text">{accumulatedSeconds} seconds</span>
          </div>
        </div>
      )}

      {/* YouTube Double-Click Right Ripple (Forward +10s / +20s / +30s) */}
      {doubleClickSide === 'right' && (
        <div className="yt-double-click-ripple yt-ripple-right">
          <div className="yt-ripple-arc">
            <div className="yt-chevrons">
              <span className="yt-chevron yt-c3">›</span>
              <span className="yt-chevron yt-c2">›</span>
              <span className="yt-chevron yt-c1">›</span>
            </div>
            <span className="yt-ripple-text">{accumulatedSeconds} seconds</span>
          </div>
        </div>
      )}

      {/* Initial Big Center Play Button (When not playing) */}
      {!isPlaying && !isBuffering && !centerFlash && (
        <div className="yt-center-play-wrapper">
          <button
            type="button"
            className="yt-center-play-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label="Play Video"
          >
            <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Top Bar: Title & Channel / Masterclass info */}
      <div className={`yt-top-bar ${showControls || !isPlaying ? 'is-visible' : ''}`}>
        <div className="yt-top-title-group">
          <span className="yt-brand-badge">AERS ACADEMY</span>
          <span className="yt-top-title">{title}</span>
        </div>
        <div className="yt-top-badges">
          <span className="yt-lang-chip">{language === 'kn' ? 'ಕನ್ನಡ (KN)' : 'ENGLISH (EN)'}</span>
        </div>
      </div>

      {/* YouTube Bottom Controls Container */}
      <div className={`yt-bottom-bar ${showControls || !isPlaying ? 'is-visible' : ''}`}>
        {/* YouTube Scrubber Progress Bar */}
        <div
          ref={scrubberTrackRef}
          className="yt-scrubber-container"
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={handleScrubberMouseLeave}
        >
          {/* Hover Time Tooltip (YouTube style timestamp floating above cursor) */}
          {hoverTime !== null && (
            <div
              className="yt-scrubber-tooltip"
              style={{ left: `${Math.max(4, Math.min(96, hoverPositionPct))}%` }}
            >
              {formatYouTubeTime(hoverTime)}
            </div>
          )}

          <div className="yt-progress-bar">
            {/* Background unbuffered bar */}
            <div className="yt-bar-bg" />
            {/* Downloaded buffer bar */}
            <div className="yt-bar-buffer" style={{ width: `${bufferedPct}%` }} />
            {/* Hover bar */}
            {hoverPositionPct > 0 && hoverTime !== null && (
              <div className="yt-bar-hover" style={{ width: `${hoverPositionPct}%` }} />
            )}
            {/* Played blue progress bar */}
            <div className="yt-bar-played" style={{ width: `${progressPercent}%` }} />
            {/* Scrubber thumb circle dot (blue glow) */}
            <div className="yt-scrubber-dot" style={{ left: `${progressPercent}%` }} />
          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min={0}
            max={duration || expectedDuration}
            step={0.1}
            value={displayTime}
            onPointerDown={handleScrubStart}
            onMouseDown={handleScrubStart}
            onTouchStart={handleScrubStart}
            onChange={handleScrubMove}
            onPointerUp={handleScrubEnd}
            onMouseUp={handleScrubEnd}
            onTouchEnd={handleScrubEnd}
            onClick={handleScrubChange}
            className="yt-range-slider"
            aria-label="YouTube scrubber timeline"
          />
        </div>

        {/* Buttons Controls Row */}
        <div className="yt-controls-row">
          {/* Left Controls */}
          <div className="yt-left-controls">
            {/* Play/Pause */}
            <button
              type="button"
              className="yt-btn yt-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title={isPlaying ? 'Pause (k)' : 'Play (k)'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 10s Rewind (YouTube style) */}
            <button
              type="button"
              className="yt-btn yt-skip-btn"
              onClick={(e) => {
                e.stopPropagation();
                triggerRewindRipple();
              }}
              title="Rewind 10 seconds (j / Left Arrow)"
              aria-label="Rewind 10s"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
              <span className="yt-skip-label">10</span>
            </button>

            {/* 10s Forward (YouTube style) */}
            <button
              type="button"
              className="yt-btn yt-skip-btn"
              onClick={(e) => {
                e.stopPropagation();
                triggerForwardRipple();
              }}
              title="Forward 10 seconds (l / Right Arrow)"
              aria-label="Forward 10s"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </svg>
              <span className="yt-skip-label">10</span>
            </button>

            {/* Volume & Hover Slider */}
            <div className="yt-volume-control">
              <button
                type="button"
                className="yt-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                title={isMuted || volume === 0 ? 'Unmute (m)' : 'Mute (m)'}
                aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L9 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onClick={(e) => e.stopPropagation()}
                onChange={handleVolumeChange}
                className="yt-volume-slider"
                aria-label="Volume slider"
              />
            </div>

            {/* YouTube Style Timestamp Display */}
            <div className="yt-time-display">
              <span className="yt-time-cur">{formatYouTubeTime(displayTime)}</span>
              <span className="yt-time-sep">/</span>
              <span className="yt-time-dur">{formatYouTubeTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="yt-right-controls">
            {/* Language Switch Toggle Button */}
            {onLanguageChange && (
              <button
                type="button"
                className="yt-btn yt-lang-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLanguageChange(language === 'en' ? 'kn' : 'en');
                }}
                title={`Switch Language to ${language === 'en' ? 'Kannada' : 'English'}`}
                aria-label="Switch Language"
              >
                <span className="yt-lang-text">{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
              </button>
            )}

            {/* YouTube Settings Gear Button */}
            <div className="yt-settings-wrapper">
              <button
                type="button"
                className={`yt-btn yt-settings-btn ${showSettings ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings((prev) => !prev);
                  setSettingsSubmenu('main');
                }}
                title="Settings"
                aria-label="Settings"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>

              {/* YouTube Settings Popover Menu */}
              {showSettings && (
                <div
                  className="yt-settings-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  {settingsSubmenu === 'main' ? (
                    <div className="yt-menu-list">
                      <div
                        className="yt-menu-item"
                        onClick={() => setSettingsSubmenu('speed')}
                      >
                        <div className="yt-menu-item-left">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                          </svg>
                          <span>Playback speed</span>
                        </div>
                        <div className="yt-menu-item-right">
                          <span>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                          <span>›</span>
                        </div>
                      </div>

                      <div className="yt-menu-item">
                        <div className="yt-menu-item-left">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                          </svg>
                          <span>Quality</span>
                        </div>
                        <div className="yt-menu-item-right">
                          <span className="yt-blue-text">1080p HD</span>
                        </div>
                      </div>

                      <div className="yt-menu-item">
                        <div className="yt-menu-item-left">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                          </svg>
                          <span>Language</span>
                        </div>
                        <div className="yt-menu-item-right">
                          <span className="yt-blue-text">{language === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="yt-menu-list">
                      <div
                        className="yt-menu-header"
                        onClick={() => setSettingsSubmenu('main')}
                      >
                        <span>‹</span>
                        <span>Playback speed</span>
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <div
                          key={rate}
                          className={`yt-menu-item ${playbackRate === rate ? 'is-selected' : ''}`}
                          onClick={() => handleSelectRate(rate)}
                        >
                          <span className="yt-check-icon">{playbackRate === rate ? '✓' : ''}</span>
                          <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen (YouTube corner brackets) */}
            <button
              type="button"
              className="yt-btn yt-fullscreen-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title={isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomVideoPlayer;
