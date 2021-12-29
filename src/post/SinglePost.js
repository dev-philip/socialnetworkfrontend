import React, { Component } from "react";
import { singlePost, remove, like, unlike } from './apiPost';
import { Redirect } from "react-router-dom";
import DefaultPost from '../images/postdefault.jpg';
import { Link } from "react-router-dom";
import { isAuthenticated} from '../auth';
import Comment from "./Comment";
const Swal = require('sweetalert2');



class SinglePost extends Component {

    state = {
        post: '',
        redirectToHome: false,
        redirectToSignIn: false,
        like: false,
        likes: 0,
        comments: [],
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1  //it would return -1 when it is not found
        return match;
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId)
        .then((data) => {   
            if(data.error){
                console.log(data.error)
            }else{ 
                console.log(data)
                this.setState({
                    post: data, 
                    likes: data.likes.length, 
                    like: this.checkLike(data.likes),
                    comments : data.comments 
                });
            }
        })
    }

    likeToggle = () => {
        if(!isAuthenticated()) {
            this.setState({
                redirectToSignIn: true,
            })

            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId )
        .then((data) => {
            if(data.error){
                console.log(data.error);
            }else{
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        })
    }

    updateComments = (comments) => {
        this.setState({
            comments
        })
    }

    deletePost = () => {
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
              this.deleteConfirmed();
              Swal.fire(
                'Deleted!',
                'Your account has been deleted.',
                'success'
              )
            }
          })
       
    }

    deleteConfirmed = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token
        remove(postId, token)
        .then((data) => {
            if(data.error){
                console.log(data.error);
            }else{
                this.setState({redirectToHome : true})
            }
        });
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown ";

        const {like, likes} = this.state;
        return (
                    <div className="card-body">
                        <img 
                            src={`${ process.env.REACT_APP_API_URL}/post/photo/${post._id}`} 
                            alt={post.title} 
                            onError={i => i.target.src = `${DefaultPost}`}
                            className="img-thunbnail mb-3"
                            style={{height: 'auto', width: '100%', objectFit: 'cover'}}
                        />

                        {
                            like ? (
                                <h4 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-success bg-dark" 
                                style={{padding: '10px', borderRadius: '50%'}} /> {` ${ likes }` } LIKE</h4>
                            ) : (
                                <h4 onClick={this.likeToggle}><i className="fa fa-thumbs-up text-warning bg-dark" 
                                style={{padding: '10px', borderRadius: '50%'}} />{` ${ likes }` } LIKE</h4>
                            )
                        }
                        <p className="card-text">{ post.body} </p>
                        <br />
                        <p className="font-italic mark">
                            Posted by { " " } 
                            <Link to={`${posterId}`}>
                                { `${posterName} ` }
                            </Link>
                            on { new Date(post.created).toDateString()}
                        </p>
                        <div className="d-inline-block">
                            <Link to={`/`} className="btn btn-raised btn-primary mr-3" style={{marginRight: '10px'}}>BACK TO POST</Link>
                            
                        { isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id &&
                        (
                            <>
                                <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5" style={{marginRight: '10px'}}>
                                    Update Post
                                </Link>

                                <button onClick={this.deletePost} className="btn btn-raised btn-danger">
                                    Delete Post
                                </button>
                            </> 
                        )
                       
                        }
                            
                        </div>
                    </div>
        )

    }

    render(){
        const { post, redirectToHome, redirectToSignIn, comments } = this.state;
        if(redirectToHome){
            return <Redirect to="/" />
        }

        if(redirectToSignIn){
            return <Redirect to="/signin" />
        }

        return(
            <div className="container">
                {!post ? (
                    <div className="jumbotron jumbotron-fluid text-center">
                        <h2>Loading.....</h2>
                    </div>
                ): (
                    <div>
                    <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                        {this.renderPost(post)}
                    </div>
                )}

                <Comment 
                    postId={post._id} 
                    comments={comments.reverse()} 
                    updateComments={this.updateComments} 
                />
                
            </div>
        )
    }
}

export default SinglePost;