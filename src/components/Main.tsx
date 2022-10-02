import React from 'react';
import { Outlet } from 'react-router-dom';

interface MainProps {
    collapsed: boolean,
    toggled: boolean
}

export const Main = ({collapsed, toggled}: MainProps) => {    
    return (
        <div>
            {
                collapsed || toggled ? 
                <Outlet /> : <Outlet />
            }
        </div>
  )
};