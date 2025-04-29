import React from 'react'
import './Loader.css'

export default function Loader() {
    return (
        <div className="loading-container">
          <div className="character-container">
            <div className="character">
              <div className="character-head">
                <div className="character-eye left"></div>
                <div className="character-eye right"></div>
              </div>
              <div className="character-body"></div>
              <div className="character-arm left"></div>
              <div className="character-arm right"></div>
            </div>
            <div className="shadow"></div>
            <div className="particles">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties}></div>
              ))}
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-text">Loading Nexora...</div>
          </div>
        </div>
      );
}
