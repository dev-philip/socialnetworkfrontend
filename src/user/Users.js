import React, {Component} from "react";
import { Link } from "react-router-dom";
import { list } from "./apiUser";
import DefaultProfile from '../images/avatar.png';

class Users extends Component {
    constructor(){
        super();
        this.state = {
            users: []
        }
    }

    componentDidMount = () => {
        list()
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
                                    <Link to={`/user/${user._id}`} className="btn btn-primary">View Profile</Link>
                                </div>
                            </div>
                    )
                })
            }
        </div>
        );
    }

    render(){
        const { users } = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">All Users</h2>  

                {this.renderUsers(users)}
            </div>
        )
    }
}

export default Users;