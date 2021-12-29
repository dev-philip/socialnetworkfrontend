import React from 'react'
import {  Route, Switch } from 'react-router-dom'
import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import NewPost from "./post/NewPost";
import PrivateRoute from './auth/PrivateRoute';
//singlepost
import SinglePost from "./post/SinglePost";
//EditPost
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

const MainRouter = () => {
    return (
        <div>
            <Menu />
            <Switch>
                <PrivateRoute exact path='/post/edit/:postId' component={EditPost} />
                <PrivateRoute exact path='/post/create' component={NewPost} />
                <PrivateRoute exact path='/findpeople' component={FindPeople} />
                <PrivateRoute exact path='/user/edit/:userId' component={EditProfile} />
                <PrivateRoute exact path='/user/:userId' component={Profile} />
                <Route exact path='/forgot-password' component={ForgotPassword} />
                <Route exact path='/reset-password/:resetPasswordToken' component={ResetPassword} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/post/:postId' component={SinglePost} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/signin' component={Signin} />
                <Route exact path='/' component={Home} />
            </Switch>
        </div>
    );
        
} 

export default MainRouter;