import { useState, useEffect, useRef, type CSSProperties } from 'react'
import '../App.css'

interface MusicPlayerProps {
  src: string
  trackName: string
  forceAutoplay?: boolean
  style?: CSSProperties
}

export function MusicPlayer({ src, trackName, forceAutoplay = false, style }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    
    // Configura volume inicial
    audio.volume = 0.4
    audio.muted = false

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const playAudio = async () => {
      try {
        await audio.play()
      } catch {
        return
      }
    }

    // Se for forceAutoplay (Lojinha), tenta imediatamente
    if (forceAutoplay) {
      playAudio()
    } else {
      // Na Home, também tenta, mas com um pequeno delay para garantir carregamento
      setTimeout(() => {
        playAudio()
      }, 500)
    }

    // Função que tenta ativar o som na primeira interação
    const enableSound = () => {
      if (audio && audio.paused) {
        audio.play()
          .catch(() => undefined)
      }
      
      // Se já estiver tocando, removemos os listeners
      if (audio && !audio.paused) {
        cleanupListeners()
      }
    }

    const events = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove', 'wheel']

    const cleanupListeners = () => {
      events.forEach(event => {
        document.removeEventListener(event, enableSound)
      })
    }

    // Adiciona gatilhos para tentar tocar na primeira ação do usuário
    events.forEach(event => {
      document.addEventListener(event, enableSound, { passive: true, once: false }) 
    })

    return () => {
      cleanupListeners()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [src, forceAutoplay]) 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => undefined)
      }
    }
  }

  return (
    <div className="music-player" style={style}>
      <audio ref={audioRef} loop preload="auto" src={src}>
      </audio>
      
      <div className="music-content">
        <button 
          onClick={togglePlay} 
          className="music-btn-simple"
          aria-label={isPlaying ? "Pausar" : "Tocar"}
        >
          {isPlaying ? (
            <span className="music-icon">❚❚</span>
          ) : (
            <span className="music-icon">▶</span>
          )}
        </button>

        <div className="music-info">
          <div className="music-scroller">
            <span className="music-track">{trackName}</span>
            <span className="music-track">{trackName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
