import React from 'react';
import './Titlebar.css';
import { WindowMinimise, WindowToggleMaximise, Quit } from '../../wailsjs/runtime';

export function Titlebar() {
  return (
    <div className="titlebar">
      <div className="titlebar-controls">
        <button className="titlebar-button btn-close" onClick={Quit}></button>
        <button className="titlebar-button btn-minimise" onClick={WindowMinimise}></button>
        <button className="titlebar-button btn-maximise" onClick={WindowToggleMaximise}></button>
      </div>
    </div>
  )
}