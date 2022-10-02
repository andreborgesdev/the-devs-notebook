import React, { useState } from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaList, FaRegLaughWink, FaHeart, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Link } from '@chakra-ui/react';
import { Content } from '../resources/Content';

interface SidebarProps {
    collapsed: boolean,
    toggled: boolean,
    handleToggleSidebar: (value: boolean) => void,
    toggleCollapse: () => void
}

export const Sidebar = ({collapsed, toggled, handleToggleSidebar, toggleCollapse}: SidebarProps) => {    
    return (
        <ProSidebar
            collapsed={collapsed}
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggleSidebar}
        >
            <SidebarHeader>
            <div
                style={{
                padding: '24px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: 14,
                letterSpacing: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                }}
            >
                <Link href='/'>A dev's notebook</Link>
                <div className='collapse-button-sidebar' onClick={() => {
                        return toggleCollapse();
                    }}>
                    {
                        collapsed ? 
                            <FaAngleDoubleRight /> :
                            <FaAngleDoubleLeft />
                    }
                </div>
            </div>
            </SidebarHeader>

            <SidebarContent>
                <Menu iconShape="circle">
                {
                    Content.map(content => {
                        return  <MenuItem icon={<FaGem />}>
                                    <a href={`${content.link}`}></a>
                                    {content.title}
                                </MenuItem>
                    })
                }
                </Menu>
            {/* <Menu iconShape="circle">
                <SubMenu
                suffix={<span className="badge yellow">3</span>}
                title={'withSufix'}
                icon={<FaRegLaughWink />}
                >
                <MenuItem>submenu 1</MenuItem>
                <MenuItem>submenu 2</MenuItem>
                <MenuItem>submenu 3</MenuItem>
                </SubMenu>
                <SubMenu
                prefix={<span className="badge gray">3</span>}
                title={'withPrefix'}
                icon={<FaHeart />}
                >
                <MenuItem>submenu' 1</MenuItem>
                <MenuItem>submenu' 2</MenuItem>
                <MenuItem>submenu' 3</MenuItem>
                </SubMenu>
                <SubMenu title={'multiLevel'} icon={<FaList />}>
                    <MenuItem>submenu 1 </MenuItem>
                    <MenuItem>submenu 2 </MenuItem>
                    <SubMenu title={`$submenu 3`}>
                        <MenuItem>submenu 3.1 </MenuItem>
                        <MenuItem>submenu 3.2 </MenuItem>
                        <SubMenu title={`$submenu 3.3`}>
                        <MenuItem>submenu 3.3.2 </MenuItem>
                        <MenuItem>submenu 3.3.1 </MenuItem>
                        <MenuItem>submenu 3.3.3 </MenuItem>
                        </SubMenu>
                    </SubMenu>
                </SubMenu>
            </Menu> */}
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <ColorModeSwitcher />
            </SidebarFooter>
        </ProSidebar>
  );
}