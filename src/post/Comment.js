import React, { Component } from "react";
import {withRouter, Link, } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { comment, uncomment } from "./apiPost";
import DefaultProfile from '../images/avatar.png';
const Swal = require('sweetalert2');


class Comment extends Component {

    constructor(){
        super();
        this.state = {
            text : "",
            error: "",
        }
    }

    handleChange = (event) => {
        this.setState({ error: ""})
        this.setState({ text: event.target.value});
    }

    isValid = () => {
        const { text } = this.state;
        if(!text.length > 0 || text.length > 150){
            this.setState({error: "Comment should not be empty and more than 150 characters"});
            return false
        }

        return true;
    }

    deleteComment = (comment) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.deleteConfirmed(comment);
              Swal.fire(
                'Deleted!',
                'Comment has been deleted.',
                'success'
              )
            }
          })
       
    }

    deleteConfirmed = (comment) => {

        const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token
            const postId = this.props.postId;
    
            uncomment(userId, token, postId, comment)
            .then((data) => {
                if(data.error){
                    console.log(data.error);
                }else{

                    //dispatch fresh list of comments to parent (SinglePost)
                    this.props.updateComments(data.comments) //update comment
                }
    
            });
        
    }

    addComment = (e) => {
        e.preventDefault();

        if(!isAuthenticated()){
            this.setState({ error: "Please signin to leave a comment"});
            return false;
        }

        if(this.isValid()){
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token
            const postId = this.props.postId;
    
            comment(userId, token, postId, { text : this.state.text })
            .then((data) => {
                if(data.error){
                    console.log(data.error);
                }else{
                    this.setState({ text: '', });
                    //dispatch fresh list of comments to parent (SinglePost)
                    this.props.updateComments(data.comments)
                }
    
            });
        }

    }

    render(){

        const { comments } = this.props;
        const { error } = this.state;
  
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Leave a comment</h2>

                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input 
                            className="form-control" 
                            type="text" 
                            onChange={this.handleChange}
                            value={this.state.text} 
                            placeholder="Leave a comment..."
                        />

                        <button className="btn btn-raised btn-success mt-2">
                            Post
                        </button>
                    </div>
                </form>

                <div className="alert alert-danger mt-2" style={{display: error ? "" : "none"}}>  { error } </div>


                <hr />
                {/* { JSON.stringify(comments)} */}
                

                <div className="col-md-12">
                        <h5 className="text-primary">{comments.length} Comments</h5>

                        <hr />
                        {
                            comments.map((comment, index) => {
                                return (
                                    <div key={index}>
                                    <div className="row">
                                        <div>
                                            <Link to={`/user/${comment.postedBy._id}`}>
                                                <img 
                                                    style={{ borderRadius: '50%', border: '1px solid black'}}
                                                    className="float-left mr-2"
                                                    height="30px"
                                                    width="30px"
                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}?${new Date().getTime()}`} 
                                                    alt={comment.postedBy.name} 
                                                    onError={i => (i.target.src = `${DefaultProfile}`)}
                                                />
                                                </Link>
                                            
                                                <span className="lead" style={{fontSize: '17px', marginLeft: '5px'}}>{comment.text}</span>

                                                    <br />
                                                    <p className="font-italic mark">
                                                        Posted by { " " } 
                                                        <Link to={`/user/${comment.postedBy._id}`}>
                                                            { comment.postedBy.name }
                                                        </Link>
                                                        { " " }  on { new Date(comment.created).toDateString()}

                                                        <span>
                                                            { isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id &&
                                                                    (
                                                                        <button onClick={() =>this.deleteComment(comment)} style={{color: 'red', float: 'right', fontSize: '15px'}} className="btn-close" title="Delete Comment" />
                                                                    )
                                                            }
                                                        </span>
                                                    </p>
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }

                </div> 
            </div>
        );
    }
}

export default withRouter(Comment);