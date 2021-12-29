import React, {Component} from "react";
import {withRouter, Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { read } from "./apiUser";
import DefaultProfile from '../images/avatar.png';
import DeleteUser from "../user/DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from '../post/apiPost';

class Profile extends Component {

    constructor(){
        super();
        this.state = {
            user: {following: [], followers: [] },
            redirectToSignin : false,
            following: false,
            error: "",
            posts: []
        }
    }


    //check for follower
    checkFollow = (user) => {
        const jwt = isAuthenticated()
        const match = user.followers.find((follower) => {
            //one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id
        });
        return match
    }

    //click follow button method
    clickFollowButton = (callApi) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id )
        .then((data) => {
            if(data.error){
                this.setState({ error: data.error})
            }else{
                this.setState({
                    user: data,
                    following: !this.state.following
                })
            }
        })

    }

    init = (userId) => {
       const token = isAuthenticated().token;

       read(userId, token)
        .then((data) => {
            if(data.error) {
                this.setState({ redirectToSignin: true })
            }else{
                let following = this.checkFollow(data)
                this.setState({ user: data, following });
                this.loadPosts(data._id)
            }
        })
    };

    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
        .then((data) => {
            if(data.error){
                console.log(data.error)
            }else{
                this.setState({ posts : data })
            }
        })

    }

    // lifecycle method
    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.init(userId);
       
    }

    componentWillReceiveProps(props){
        const userId = props.match.params.userId;
        this.init(userId);
       
    }

    render(){

        const { redirectToSignin, user, posts} = this.state
        if(redirectToSignin){
            return <Redirect to="/signin" />
        }
        const photoUrl = user._id 
        ? `${ process.env.REACT_APP_API_URL }/user/photo/${user._id }?${new Date().getTime()}` 
        : DefaultProfile


        return(
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img
                            // src="https://mdbootstrap.com/img/new/standard/nature/184.jpg"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            className="card-img-top"
                            alt={user.name}
                            style={{
                                width: "300px",
                                height: "300px",
                            }}
                        />
                        
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Hello {user.email}</p>
                            <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                        </div>
                        
                        {/* jsx */}

                        { isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                            <>
                                <div className="d-inline-block">
                                    <Link to={`/post/create`} className="btn btn-raised btn-info mr-5" style={{marginRight: '10px'}}>
                                        Create Post
                                    </Link>
                                
                                    <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">
                                        Edit Profile
                                    </Link>

                                    <DeleteUser userId={user._id} />
                                </div>
                            </>
                        ) : (
                            <FollowProfileButton onButtonClick={this.clickFollowButton} following={this.state.following} />
                        ) }

                    </div>

                </div>

                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <label className="text-primary fw-bold">About Yourself</label>
                        <hr />
                        <p className="lead">{ user.about }</p>
                        <hr />

                        <ProfileTabs 
                            followers={ user.followers } 
                            following={ user.following }
                            posts = {posts}
                        />

                    </div>
                </div>
            </div>
        );
    };
}

export default withRouter(Profile);