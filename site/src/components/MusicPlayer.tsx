import { useState, useEffect, useRef } from 'react'
import '../App.css'

interface MusicPlayerProps {
  src: string
  trackName: string
  forceAutoplay?: boolean
  style?: React.CSSProperties
}

export function MusicPlayer({ src, trackName, forceAutoplay = false, style }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Resetar estado ao mudar a música
    setIsPlaying(false)
    
    // Configura volume inicial
    audio.volume = 0.4
    audio.muted = false

    const playAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        // Se falhar (bloqueio do navegador), apenas silenciamos o erro
        // e aguardamos a interação do usuário nos listeners abaixo.
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
          .then(() => setIsPlaying(true))
          .catch(() => {})
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
    }
  }, [src, forceAutoplay]) 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
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
