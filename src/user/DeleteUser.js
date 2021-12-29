import React, {Component} from "react";
import { remove } from "./apiUser";
import { signout } from "../auth";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
const Swal = require('sweetalert2');

class DeleteUser extends Component {
    state = {
        redirect: false
    }

    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId
        remove(userId, token)
        .then((data) => {
            if(data.error){
                console.log(data.error)
            }else{
                //signout user
                signout(() => console.log("User is deleted"))
                //redirect
                this.setState({redirect: true })
            }
        })
    }

    deleteConfirmed = () => {
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
              this.deleteAccount();
              Swal.fire(
                'Deleted!',
                'Your account has been deleted.',
                'success'
              )
            }
          })
    }
    render(){
        if(this.state.redirect) {
            return <Redirect to="/" />
        }

        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger" style={{marginLeft: '10px'}}>
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;