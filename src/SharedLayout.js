import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import {AppProvider} from './Context'

function SharedLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <footer className="App-footer">
                <h4 style={{fontWeight:'400'}}>coding-queries &copy; 2023</h4>
                <Link onClick={(e) => window.scrollTo({top:0,behavior:'smooth'})} to='/faq' style={{textDecoration:'none'}}>FAQ</Link>
            </footer>
        </>
    );
}

export default SharedLayout;