import React from 'react'
import LogoEnova from '../LogoEnova.jpg'; 
import {SidebarData} from "../Data/Data";
import {UilSignOutAlt} from '@iconscout/react-unicons'
import './Sidebar.css'
import  {useState} from 'react';
import {useNavigate} from "react-router-dom"
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';




const Sidebar =() =>{
    const navigate = useNavigate();
    const[selected, setSelected] = useState(-1);
    const handleLogout = () => {
        console.log("logout");
navigate('/login');
      };
    useEffect(() => {
        console.log('selected' , selected);
        if(selected === 0)
        {
        navigate("/Dashboard");
        }
        else if(selected === 1)
        {
            navigate("/ListUsers");
        }
        else if(selected === 2)
        {
            navigate("/ListRobot");
        }
        else if(selected === 3)
        {
            navigate("/HistoriquePage");
        }
        else if(selected === 4)
        {
            navigate("/Statistiques");
        }

      }, [selected]);
      
    return (
        <div className='Sidebar'>
            <div className='Enova'>
                <img src={LogoEnova} alt="logoEnova" />
            </div>
            <div className='menu'>
                {SidebarData.map((item, index)=>{
                    return(
                        <div className={selected===index?'menuItem active': 'menuItem'}
                        key={index}
                        onClick={()=>setSelected(index)}

                        >
                            <item.icon/>
                            <span>
                                {item.heading}
                            </span>
                        </div>
                    )
                })}
            <div className='menuItem'>
                <UilSignOutAlt onClick={handleLogout}></UilSignOutAlt>
                </div>  
            </div>
        
        </div>
    )
}

export default Sidebar