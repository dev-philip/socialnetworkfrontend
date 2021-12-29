import React, { Component } from "react";
import {withRouter, Redirect, } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { singlePost, } from "./apiPost";
import { update} from "./apiPost";


class EditPost extends Component {

    constructor(){
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
        }
    }
    
    init = (postId) => {
 
        singlePost(postId)
         .then((data) => {
             if(data.error) {
                 this.setState({  redirectToProfile: true })
             }else{
                 this.setState({ 
                     id: data._id, 
                     title: data.title, 
                     body: data.body, 
                     error: '',
                });
             }
         })
     }
 
     // lifecycle method
     componentDidMount(){
         this.postData = new FormData();
         const postId = this.props.match.params.postId;
         this.init(postId);
        
     }

     isValid = () => {
        const {title, body, fileSize, } = this.state;

        // if(!photo){
        //    this.setState({error: "An Image is required to create a post"})
        //    return false;
        // }

        if(fileSize > 100000000000){ //bytes code
           this.setState({error: "File size should be less than 100KB"})
           return false;
        } 

        if(title.length === 0 || body.length === 0){
           this.setState({error: "All fields are required"})
           return false;
        }

        return true;
    }

     handleChange = (name) => (event) => { //higher order function
        this.setState({error: ''});
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(name, value)
        this.setState({[name]: value, fileSize}); 
    } 

    clickSubmit = (event) => {
        event.preventDefault();

        if(this.isValid()){

            this.setState({ loading: true });
            const postId = this.state.id;
            const token = isAuthenticated().token;
    
            update(postId, token, this.postData)
            .then((data) => {
                if(data.error){
                    this.setState({error: data.error, loading: false})
                }else{
                    this.setState({ loading: false, title: '', body: '', photo: '', redirectToProfile: true})
                }
            })
        }

    }

    editPostForm = (title, body, loading) => {
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
                    <label className="text-primary fw-light">Post Title</label>
                    <input 
                        onChange={this.handleChange("title") } 
                        type="text" 
                        className="form-control" 
                        value={ title }
                    />
                </div>


                <div className="form-group mb-4">
                    <label className="text-primary fw-light">Post Body</label>
                    <textarea 
                        onChange={this.handleChange("body") } 
                        type="text" className="form-control" 
                        value={ body }
                    />
                </div>



                <button onClick={this.clickSubmit} className="btn btn-primary btn-block mb-4">
                    {loading ? "Loading..." : "Update Post"}
                </button>

            </form>
        );
    }


     
    render(){
        const { id, title, body, loading, redirectToProfile, error} = this.state;

        if(redirectToProfile){
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }

        const photoUrl = `${ process.env.REACT_APP_API_URL }/post/photo/${id}?${new Date().getTime()}`;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{ title }</h2>
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>  { error } </div>

                <img 
                    src= { photoUrl } 
                    className="img-thumbnail" 
                    alt={ title } 
                    style={{
                        width: "auto",
                        height: "300px",
                    }}
                />
                
            
                {this.editPostForm(title, body, loading)}
            </div>
        );
    }
}

export default withRouter(EditPost);