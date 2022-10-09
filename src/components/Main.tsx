import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import { Box, useStyleConfig, useColorModeValue } from '@chakra-ui/react';

interface MainProps {
    collapsed: boolean,
    toggled: boolean,
    handleToggleSidebar: (value: boolean) => void,
    toggleCollapse: () => void
}

export const Main = ({collapsed, toggled, handleToggleSidebar, toggleCollapse}: MainProps) => {    
    const color = useColorModeValue('rgb(55, 53, 47)', 'rgba(255, 255, 255, 0.81)')

    return (
        <main>
            <div>
                <div className="btn-toggle" onClick={() => {
                        handleToggleSidebar(true)
                    }}>
                    <FaBars color={color} />
                </div> 
                <div className="block ">
                    <Outlet />
                </div>
            </div>
        </main>
  )
}
