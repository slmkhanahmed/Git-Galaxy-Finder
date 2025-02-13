import React from 'react';
import ReactDOM from 'react-dom/client';
import "./popup.css";
function PopupApp() {
  const handleGitHubLogin = () => {
    // Add GitHub OAuth implementation here
    chrome.runtime.sendMessage({ action: 'githubLogin' });
  };

  return (
    <div className="popup-container">
      <div className="login-screen">
        <div className="text-center">
          <h3 className="mb-2">Welcome to Gehance</h3>
          <p className="description">Enhance your GitHub workflow with powerful tools</p>
          <button onClick={handleGitHubLogin} className="github-button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="developer-card">
          <img 
            src="https://avatars.githubusercontent.com/slmkhanahmed" 
            className="developer-avatar"
            alt="Salman Ahmed"
          />
          <div>
            <h4 className="mb-1">Salman Ahmed</h4>
            <p className="role">Software Engineer</p>
            <p className="bio">
              Full-stack developer specializing in building scalable web applications 
              and browser extensions. Open source contributor with focus on:
              <ul className="expertise">
                <li>Cloud Architecture & Distributed Systems</li>
                <li>Performance Optimization</li>
                <li>DevOps & CI/CD Pipelines</li>
                <li>Cross-platform Extension Development</li>
              </ul>
            </p>
            <div className="profile-links">
              <a href="https://github.com/slmkhanahmed" target="_blank" rel="noopener">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/salman-kkhan" target="_blank" rel="noopener">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="support-section">
          <p>Support continued development</p>
          <a href="https://www.payoneer.com" 
             className="payoneer-button"
             target="_blank" 
             rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20.5 0h-17A2.5 2.5 0 001 2.5v19A2.5 2.5 0 003.5 24h17a2.5 2.5 0 002.5-2.5v-19A2.5 2.5 0 0020.5 0zm-8.2 14.3H9.7v3.6H7.2V6.1h5.1c2.1 0 3.5 1.4 3.5 3.3 0 1.8-1.4 3.1-3.5 3.1zm0-5.4H9.7v4.2h2.6c1.4 0 2.3-.9 2.3-2.1s-.9-2.1-2.3-2.1zm7.3 10.3h-2.6v-2.9c0-1.1-.4-1.8-1.5-1.8-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.7v3h-2.6v-3.7c0-1.2 0-2.1.1-2.8h2.3l.1 1.2h.1c.3-.6 1.1-1.5 2.8-1.5 1.8 0 3.1 1.2 3.1 3.7v3.1z"/>
            </svg>
            Support via Payoneer
          </a>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
);