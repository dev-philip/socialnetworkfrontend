import React, { Component} from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {

    followClick = () => {
        // follow returns a function 
        this.props.onButtonClick(follow); //props sent from Profile js
    }

    unfollowClick = () => {
        // follow returns a function 
        this.props.onButtonClick(unfollow); //props sent from Profile js
    }

    render() {
        return(
            <div className="d-inline-block">
                {
                    !this.props.following ? 
                    (
                        <button onClick={this.followClick} className="btn btn-success btn-raised" style={{marginRight: '10px'}}>
                            Follow
                        </button>

                    ) : (
                        <button onClick={this.unfollowClick} className="btn btn-warning btn-raised">
                            UnFollow
                        </button>

                    )
                }
                
            </div>
        );

    }
}

export default FollowProfileButton;