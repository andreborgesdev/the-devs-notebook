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

    // const [collapsed, setCollapsed] = useState<boolean>(() => {
    //     const value = window.localStorage.getItem('sidebar-collapsed');
    //     return value ? (JSON.parse(value) as boolean) : false;
    // })

    // const [toggled, setToggled] = useState<boolean>(() => {
    //     const value = window.localStorage.getItem('sidebar-toggled');
    //     return value ? (JSON.parse(value) as boolean) : false;
    // })

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