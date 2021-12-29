import React, {Component} from "react";
import { Link } from "react-router-dom";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from '../images/avatar.png';
import { isAuthenticated } from '../auth';

class FindPeople extends Component {
    constructor(){
        super();
        this.state = {
            users: [],
            error: '',
            open: false,
        }
    }

    clickFollow  = (user, index) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id )
        .then(data => {
            if(data.error){
                this.setState({error: data.error });
            }else{
               let toFollow = this.state.users;
               toFollow.splice(index, 1)
               this.setState({
                   users: toFollow,
                   open: true,
                   followMessage: `Following ${user.name}`
               })

            }
        })

    }

    componentDidMount = () => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token)
        .then(data => {
            if(data.error){
                console.log(data.error)
            }else{
                this.setState({ users: data})
            }
        })
    }

    renderUsers = (users) => {
        return (
        <div className="row">
            {
                users.map((user, index) => {
                    return (
                        <div key={index} className="card col-md-4" style={{ marginBottom: "15px",}}>
                                <img
                                    // src="https://mdbootstrap.com/img/new/standard/nature/184.jpg"
                                    src={ `${process.env.REACT_APP_API_URL }/user/photo/${user._id}` }
                                    onError={i => (i.target.src = `${DefaultProfile}`)}
                                    className="card-img-top"
                                    alt="Profile"
                                    style={{
                                        width: "auto",
                                        height: "auto",
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{ user.name }</h5>
                                    <p className="card-text">
                                    Some quick example text to build on the card title and make up the bulk of the
                                    card's content.
                                    </p>
                                    <Link to={`/user/${user._id}`} className="btn btn-primary" style={{marginRight: '10px'}}>View Profile</Link>
                                    <button onClick={() => this.clickFollow(user, index)} className="btn btn-secondary"> Follow</button>
                                </div>
                            </div>
                    )
                })
            }
        </div>
        );
    }

    render(){
        const { users, open, followMessage} = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2> 

                {open && (
                    <div className="alert alert-success">
                        {followMessage}
                    </div>
                )} 
  
                {this.renderUsers(users)}
            </div>
        )
    }
}

export default FindPeople;