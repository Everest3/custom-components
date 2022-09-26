import React, { useState } from 'react'
import "./sidebar.css"
import { v4 as uuid} from 'uuid';
import { Link } from 'react-router-dom';
import { BiChevronDown } from "react-icons/bi";
import { CSSTransition } from 'react-transition-group';
const SideBar = () => {
  const [navlinks,setNavlinks]=useState([
    {
      id:uuid(),
      title:"Grid",
      link:"/",
    },
    {
      id:uuid(),
      title:"DropDown Title",
      collapsed:false,
      children:[
        {
          id:uuid(),
          title:"SubMenu",
          link:"/",
        },
        {
          id:uuid(),
          title:"DropDown SubMenu",
          collapsed:false,
          children:[
            {
              id:uuid(),
              title:"Nested Title",
              link:"/",
            },
          ]
        }
      ]
    },
    {
      id:uuid(),
      title:"Small Components",
      link:"/small-components",
    },

  ])

  // const nestedNavlinks=()=>{
  //   return 
  // }
  // 

  const deepTreeMutate=(navlinks,id)=>{
    console.log({navlinksId:id})
    return navlinks.map((navlink)=>{
      if(navlink.id===id){
        return {...navlink,collapsed:!navlink.collapsed}
      }
      if(navlink?.children){
        return {...navlink,children:deepTreeMutate(navlink.children,id)}
      }
      return {...navlink}
    })
  }

  const handleCollapse=(id)=>{

    setNavlinks((navlinks)=>{
      return deepTreeMutate(navlinks,id)
    })
  }

console.log({navlinks})
const recursiveNavlinks=(navlinks)=>{
  return <div className="navlinks">
  {navlinks.map(navlink=>{
    if(navlink?.children){
      return <div className="menu-container navlink" onClick={()=>handleCollapse(navlink.id)}>
        <div className="menu-header">
        <div>{navlink.title}</div>
        <CSSTransition in={navlink?.collapsed} timeout={100} classNames="collapse">         
           <BiChevronDown size={20}/>
        </CSSTransition>
        </div>
        { navlink?.collapsed && navlink.children && <div style={{paddingLeft:15}}>{recursiveNavlinks(navlink.children)}</div>}
      </div>
    }
    return <Link key={navlink.id} className="navlink" to={navlink.link}>{navlink?.title}</Link>
  })}
  </div>   
}

  return (
    <div className='sidebar'>
      {recursiveNavlinks(navlinks)}
    </div>
  )
}

const MenuContainer=({navlink,recursiveNavlinks})=>{
  const [collapsed,setCollapsed]=useState(false)
  return <div className="menu-container navlink" onClick={()=>setCollapsed(collapsed=>!collapsed)}>
      <div className="menu-header">
      <div>{navlink.title}</div>
      <CSSTransition in={collapsed} timeout={100} classNames="collapse">         
          <BiChevronDown size={20}/>
      </CSSTransition>
      </div>
      { collapsed && navlink.children && <div style={{paddingLeft:15}}>{recursiveNavlinks(navlink.children)}</div>}
    </div>
}

export default SideBar
