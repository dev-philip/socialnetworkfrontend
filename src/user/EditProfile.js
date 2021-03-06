import React, { Component } from "react";
import {withRouter, Redirect, } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { read, update, updateUser, } from "./apiUser";
import DefaultProfile from '../images/avatar.png';

class EditProfile extends Component {

    constructor(){
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            loading: false,
            error: "",
            fileSize: 0,
            about: "",
        }
    }
    
    init = (userId) => {
        const token = isAuthenticated().token;
 
        read(userId, token)
         .then((data) => {
             if(data.error) {
                 this.setState({  redirectToProfile: true })
             }else{
                 this.setState({ 
                     id: data._id, 
                     name: data.name, 
                     email: data.email, 
                     error: '',
                     about: data.about
                });
             }
         })
     }
 
     // lifecycle method
     componentDidMount(){
         this.userData = new FormData();
         const userId = this.props.match.params.userId;
         this.init(userId);
        
     }

     isValid = () => {
         const {name, email, password, fileSize} = this.state;

         if(fileSize > 100000){ //bytes code
            this.setState({error: "File size should be less than 100KB"})
            return false;
         } 

         if(name.length === 0){
            this.setState({error: "Name is required"})
            return false;
         }

         if(!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(email)){ //if it is not a valid email
            this.setState({error: "Email is not valid"})
            return false;
         }

         if(password.length >= 1 && password.length <= 5){
            this.setState({error: "Password must be 6 characters long"})
            return false;
         }

         return true;
     }

     handleChange = (name) => (event) => { //higher order function
        this.setState({error: ''});
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(name, value)
        this.setState({[name]: value, fileSize}); 
    } 

    clickSubmit = (event) => {
        event.preventDefault();

        if(this.isValid()){
            this.setState({ loading: true });
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
    
            update(userId, token, this.userData)
            .then(data => {
                if(data.error){
                    this.setState({error: data.error, loading: false})
                }else{
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true,
                            loading: false,
                        })
                    })
                   
                }
            })
        }

    }

    updateForm = (name, email, password, loading, about) => {
        return (
        <form>
            <div className="form-group mb-4">
                <label className="text-primary fw-light">Profile Photo</label>
                <input 
                    onChange={this.handleChange("photo") } 
                    type="file" 
                    accept="image/*"
                    className="form-control" 
                />
            </div>

            <div className="form-group mb-4">
                <label className="text-primary fw-light">Enter Name</label>
                <input 
                    onChange={this.handleChange("name") } 
                    type="text" 
                    className="form-control" 
                    value={ name }
                />
            </div>

            <div className="form-group mb-4">
                <label className="text-primary fw-light">Enter Email</label>
                <input 
                    onChange={this.handleChange("email") } 
                    type="email" className="form-control" 
                    value={ email }
                />
            </div>

            <div className="form-group mb-4">
                <label className="text-primary fw-light">About</label>
                <textarea 
                    onChange={this.handleChange("about") } 
                    type="text" className="form-control" 
                    value={ about }
                />
            </div>

            <div className="form-group mb-4">
                <label className="text-primary fw-light">Enter Password</label>
                <input 
                    onChange={this.handleChange("password") } 
                    type="password" className="form-control" 
                    value={ password }
                />
            </div>

            <button onClick={this.clickSubmit} className="btn btn-primary btn-block mb-4">
                {loading ? "Loading..." : "Update"}
            </button>

            </form>
            );
    }


     
    render(){
        const {id, name, email, password, redirectToProfile, loading, error, about} = this.state;

        if(redirectToProfile){
            return <Redirect to={`/user/${id}`} />
        }
        const photoUrl = id ? `${ process.env.REACT_APP_API_URL }/user/photo/${id}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>  { error } </div>
                
                <img 
                    src= { photoUrl } 
                    className="img-thumbnail" 
                    alt={ name } 
                    style={{
                        width: "auto",
                        height: "300px",
                    }}
                />
                {this.updateForm(name, email, password, loading, about)}
            </div>
        );
    }
}

export default withRouter(EditProfile);