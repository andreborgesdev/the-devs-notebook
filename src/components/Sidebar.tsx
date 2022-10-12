import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Link } from '@chakra-ui/react';
import { Content, ContentItem } from '../data/Content';
import { SettingsModal } from './SettingsModal';
import parse, { HTMLReactParserOptions, domToReact }  from 'html-react-parser';
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    collapsed: boolean,
    toggled: boolean,
    handleToggleSidebar: (value: boolean) => void,
    toggleCollapse: () => void
}

function getAllContent(contentItem: ContentItem[]): string {
    let result: string = "";

    contentItem.forEach(it => {
        if (it.subContent !== undefined && it.subContent.length > 0) {
            result += `<SubMenu title='${it.title}' icon='${it.icon}'>`
            result += getAllContent(it.subContent)
            result += "</SubMenu>"
        } else {
            result += `<MenuItem icon='${it.icon}' href='${it.link}' title='${it.title}'>
                            <Link href='${it.link}'>${it.title}</Link>
                        </MenuItem>`
        }
    })

    return result;
}

const options: HTMLReactParserOptions = {
    replace: ({ name, attribs, children }: any) => {
        if (!name) return;

        if (name === "menuitem") {
            return (
                <MenuItem   icon={attribs.icon}         
                            onClick={() => {
                                window.history.pushState({}, attribs.title, `${attribs.href === '/' ? '' : '/'}${attribs.href}`);
                                window.location.reload();
                            }}
                >
                    {domToReact(children, options)}
                </MenuItem>
            )
        }

        if (name === "submenu") {
            return (
                <SubMenu title={attribs.title} icon={attribs.icon}>{domToReact(children, options)}</SubMenu>
            )
        }
    }
}

export const Sidebar = ({collapsed, toggled, handleToggleSidebar, toggleCollapse}: SidebarProps) => {  
    const navigate = useNavigate()

    //const color = useColorModeValue('rgb(55, 53, 47)', 'rgba(255, 255, 255, 0.81)')
    // const bg = useColorModeValue('rgb(251, 251, 250)', 'rgb(25, 25, 25)')
    //const bg = useColorModeValue('red', 'red')
    
    return (
        <ProSidebar
            collapsed={collapsed}
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggleSidebar}
            //style={{color: color}}
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
                <Link href='/'>
                    A dev's notebook
                </Link>
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
                <Menu>
                { 
                    parse(getAllContent(Content), options)
                }
                </Menu>
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <SettingsModal />
                <ColorModeSwitcher />
            </SidebarFooter>
        </ProSidebar>
  );
}