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

  const handleCollapse=(id)=>{
    setNavlinks((navlinks)=>{
      return navlinks.map((navlink)=>{
        if(navlink.id===id){
          return {...navlink,collapsed:!navlink.collapsed}
        }
        return {...navlink}
      })
    })
  }

  
  console.log({navlinks})


const recursiveNavlinks=(navlinks)=>{
  return <div className="navlinks">
  {navlinks.map(navlink=>{
    if(navlink?.children){
      return <MenuContainer key={navlink.id} navlink={navlink} recursiveNavlinks={recursiveNavlinks}/>
      //  <div className="menu-container navlink" onClick={()=>handleCollapse(navlink.id)}>
      //   <div className="menu-header">
      //   <div>{navlink.title}</div>
      //   <CSSTransition in={navlink?.collapsed} timeout={100} classNames="collapse">         
      //      <BiChevronDown size={20}/>
      //   </CSSTransition>
      //   </div>
      //   { navlink?.collapsed && navlink.children && <div style={{paddingLeft:15}}>{recursiveNavlinks(navlink.children)}</div>}
      // </div>
    }
    return <Link key={navlink.id} className="navlink" to={navlink.link}>{navlink?.title}</Link>
  })}
  </div>   
}

  return (
    <div className='sidebar'>
      {recursiveNavlinks(navlinks)}
      {/* <div className="navlinks">
      {navlinks.map(navlink=>{
        if(navlink?.children){
          return <div className="menu-container navlink" onClick={()=>handleCollapse(navlink.id)}>
            <div className="menu-header">
            <div>{navlink.title}</div>
            <CSSTransition in={navlink?.collapsed} timeout={100} classNames="collapse">         
               <BiChevronDown size={20}/>
            </CSSTransition>
            </div>
          { navlink?.collapsed && <div className='navlinks'>
              {navlink.children.map(navlink=>{
                if(navlink?.children){

                return <div className="menu-header navlink" onClick={()=>handleCollapse(navlink.id)}>
                <div>{navlink.title}</div>
                <CSSTransition in={navlink?.collapsed} timeout={100} classNames="collapse">         
                   <BiChevronDown size={20}/>
                </CSSTransition>
                </div>

                }
        return <Link className="navlink" to={navlink.link}>{navlink?.title}</Link>

              })}
            </div>}
            
          </div>
        }
        return <Link className="navlink" to={navlink.link}>{navlink?.title}</Link>
      })}
      </div>   */}

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