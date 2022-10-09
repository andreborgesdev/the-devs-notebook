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
            result += `<MenuItem icon='${it.icon}'>
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
                <MenuItem icon={attribs.icon}>
                    {domToReact(children, options)}
                </MenuItem>
            )
        }

        if (name === "link") {
            return (
                <Link href={attribs.href}>{domToReact(children, options)}</Link>
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