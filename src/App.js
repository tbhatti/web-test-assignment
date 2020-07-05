import React from 'react';
import './App.css';
import RSSFeed from './rss-feeds/index';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="https://github.com/mylivn-gmbh/web-test-assignment"  target="_blank" rel="noopener noreferrer">
        Web Test Assignment
        </a>
      </header>
      <RSSFeed></RSSFeed>
    </div>
  );
}

export default App;
