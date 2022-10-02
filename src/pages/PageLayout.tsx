import React, { useState } from 'react';
import { Main } from '../components/Main';
import { Sidebar } from '../components/Sidebar';

export const PageLayout = () => {    
    const [state, setState] = useState({
        collapsed: false,
        toggled: false
    })

    const handleToggleSidebar = (value: boolean) => {
        setState({
            ...state,
            toggled: value
        })
      }

    const toggleCollapse = () => {
        setState({
            ...state,
            collapsed: !state.collapsed
        })
    }

    return (
        <div className={`app ${state.toggled ? 'toggled' : ''}`}>
            <Sidebar
                collapsed={state.collapsed}
                toggled={state.toggled}
                handleToggleSidebar={handleToggleSidebar}
                toggleCollapse={toggleCollapse}
            />
            <Main
                collapsed={state.collapsed}
                toggled={state.toggled} 
            />
      </div>
  )
};