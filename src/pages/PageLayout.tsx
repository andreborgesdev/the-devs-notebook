import { useEffect, useState } from 'react';
import { Main } from '../components/Main';
import { Sidebar } from '../components/Sidebar';
import { usePersistedState } from '../helpers/PersistedState';

interface test {
    collapsed: boolean,
    toggled: boolean
}

export const PageLayout = () => {  
    const [collapsed, setCollapsed] = usePersistedState<boolean>(false, 'sidebar-collapsed');
    const [toggled, setToggled] = usePersistedState<boolean>(false, 'sidebar-toggled');

    const handleToggleSidebar = (value: boolean) => {
        setToggled(value)
      }

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div className={`app ${toggled ? 'toggled' : ''}`}>
            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                toggleCollapse={toggleCollapse}
            />
            <Main
                collapsed={collapsed}
                toggled={toggled} 
                handleToggleSidebar={handleToggleSidebar}
                toggleCollapse={toggleCollapse}
            />
      </div>
  )
};