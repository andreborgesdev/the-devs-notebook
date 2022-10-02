import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

interface MainProps {
    collapsed: boolean,
    toggled: boolean,
    handleToggleSidebar: (value: boolean) => void,
    toggleCollapse: () => void
}

export const Main = ({collapsed, toggled, handleToggleSidebar, toggleCollapse}: MainProps) => {    
    return (
        <main>
            {
                // collapsed || toggled ? 
                <div>
                    <div className="btn-toggle" onClick={() => {
                            handleToggleSidebar(true);
                            toggleCollapse()
                        }}>
                        <FaBars />
                    </div> 
                    <div className="block ">
                        <Outlet />
                    </div>
                </div>
                // : <Outlet />
            }
        </main>
  )
};