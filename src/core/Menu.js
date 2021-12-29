import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated, isActive } from '../auth';



const Menu = ({history}) => {
    return (
        <div style={{marginBottom: '90px'}}>
            <ul className="nav nav-tabs bg-primary bg-gradient fixed-top">
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/users")} to="/users">Users</Link>
                </li>

                <li className="nav-item">
                        <Link to={`/post/create`} className="nav-link" style={
                            (isActive(history, `/post/create`)) 
                        }>
                            Create Post
                        </Link>
                </li>

                {!isAuthenticated() && (
                    //reactfragment
                    <> 
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Sign In</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Sign Up</Link>
                        </li>
                    </>
                )}
               {isAuthenticated() && (
                   <>
                  <li className="nav-item">
                        <Link to={`/findpeople`} className="nav-link" style={
                            (isActive(history, `/findpeople`)) 
                        }>
                            Find People
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to={`/user/${isAuthenticated().user._id}`} className="nav-link" style={
                            (isActive(history, `/user/${isAuthenticated().user._id}`)) 
                        }>
                            {`${isAuthenticated().user.name}'s Profile`}
                        </Link>
                    </li>
                    

                    <li className="nav-item">
                        <button className="nav-link" 
                            style={
                                (isActive(history, "/signup"), 
                                {cursor: "pointer", color: "#fff"})
                            } 
                            onClick={() => signout(() => history.push('/'))} 
                        >Sign Out</button>
                    </li>
                   </>
               )

               }

            </ul>
        </div>
    )

}

export default withRouter(Menu);


