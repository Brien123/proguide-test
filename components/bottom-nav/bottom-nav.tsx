import * as React from 'react';

import styles from './bottom-nav.module.css';
import Container from 'react-bootstrap/Container';
import NavBar from 'react-bootstrap/Navbar';
import { bottomnav } from '../../types';
import { useRouter, usePathname } from 'next/navigation';
import { NavLink } from 'react-bootstrap';

const BottomNav: React.FC<bottomnav> = ({ id }) => {

    const router = useRouter();
    const pathname = usePathname();


    return (
        <NavBar expand="lg" fixed="bottom" variant="white" bg="light" className="py-3 bdr">
            <Container className=" d-flex justify-content-center ">
                <NavLink href="/dashboard"  className="  vstack d-flex align-items-center justify-content-center">

                <i className={pathname == "/dashboard" ? "bi bi-house bluedefault  h1" : "bi bi-house h2"} ></i>
                
                </NavLink>
                <NavLink className=" vstack d-flex align-items-center justify-content-center" href="/battle">
                    <i className={pathname == "/battle" ? " bluedefault bi bi-controller h1 fa-6x" : "bi bi-controller fa-2x h2"}></i>
                </NavLink>
                <NavLink className=" vstack d-flex align-items-center justify-content-center" href="/profile">
                    <i className={pathname == "/profile" ? " bluedefault fa fa-user  h1" : " fa fa-user h2"}></i>
                </NavLink>
                <NavLink className=" d-flex align-items-center justify-content-center vstack" href="/notification">
                <i className={pathname == "/notification" ? "bluedefault fa fa-bell h1" : " fa fa-bell h2"}></i>
                </NavLink>


            </Container>
        </NavBar>
    );
}



export default BottomNav;
