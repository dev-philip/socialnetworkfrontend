import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../auth';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            loading: false,
        };
    }

    handleChange = (name) => (event) => { //higher order function
        this.setState({error: ""})
        this.setState({[name]: event.target.value});
        
    } 

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({ loading: true })

        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        };
        signup(user)
        .then((data)=>{
            if(data.error){
                this.setState({error: data.error, loading: false})
            }else{
                this.setState({
                    error: "",
                    name: "",
                    email: "",
                    password: "",
                    open: true,
                    loading: false,
                })
            }
        })
    }


    signupForm = (name, email, password, loading) => {
        return (
        <form>
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
                        <label className="text-primary fw-light">Enter Password</label>
                        <input 
                            onChange={this.handleChange("password") } 
                            type="password" className="form-control" 
                            value={ password }
                        />
                    </div>


                    <button onClick={this.clickSubmit} className="btn btn-primary btn-block mb-4">
                        {loading ? "Loading..." : "Sign Up"}
                    </button>

                </form>
            );
    }

    render(){
        const {name, email, password, error, open, loading} = this.state;
        return(
            
            <div className="container">
                <h2 className="mt-5 mb-5">Sign Up Here</h2>
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>  { error } </div>

                <div className="alert alert-success" style={{display: open ? "" : "none"}}>  New account is successfully created. Please <Link to="/signin"> Sign In</Link> </div>

                {this.signupForm(name, email, password, loading)}
            </div>
        );
    }

  
}

export default Signup;