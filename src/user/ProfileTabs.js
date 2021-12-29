import React, { Component } from "react";
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/avatar.png';

class ProfileTabs extends Component {

    render(){
        const { following, followers, posts } = this.props;
        return (
            <div>
                <div className="row">
                    {/* followers */}
                    <div className="col-md-4">
                        <h5 className="text-primary"> Followers</h5>

                        <hr />
                        {
                            followers.map((person, index) => {
                                return (
                                    <div key={index}>
                                    <div className="row">
                                        <div>
                                            <Link to={`/user/${person._id}`}>
                                                <img 
                                                    style={{ borderRadius: '50%', border: '1px solid black'}}
                                                    className="float-left mr-2"
                                                    height="30px"
                                                    width="30px"
                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}?${new Date().getTime()}`}
                                                    onError={i => (i.target.src = `${DefaultProfile}`)} 
                                                    alt={person.name} 
                                                    
                                                />
                                                <span className="lead" style={{fontSize: '17px', marginLeft: '5px'}}>{person.name}</span>
                                            </Link>
                                           
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }

                    </div>

                    {/* following */}
                    <div className="col-md-4">
                        <h5 className="text-primary"> Following</h5>

                        <hr />
                        {
                            following.map((person, index) => {
                                return (
                                    <div key={index}>
                                    <div className="row">
                                        <div>
                                            <Link to={`/user/${person._id}`}>
                                                <img 
                                                    style={{ borderRadius: '50%', border: '1px solid black'}}
                                                    className="float-left mr-2"
                                                    height="30px"
                                                    width="30px"
                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}?${new Date().getTime()}`} 
                                                    alt={person.name} 
                                                    onError={i => (i.target.src = `${DefaultProfile}`)}
                                                />
                                                <span className="lead" style={{fontSize: '17px', marginLeft: '5px'}}>{person.name}</span>
                                            </Link>
                                            
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }

                    </div>


                    {/* posts */}
                    <div className="col-md-4">
                        <h5 className="text-primary"> Posts</h5>
                        <hr />
                        {
                            posts.map((post, index) => {
                                return (
                                    <div key={index}>
                                    <div className="row">
                                        <div>
                                            <Link to={`/post/${post._id}`}>
                                                <div>
                                                    <p className="lead">{post.title}</p>
                                                </div>
                                            </Link>
                                            
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileTabs;