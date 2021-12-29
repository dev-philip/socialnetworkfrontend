import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';

class Signin extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
        };
    }

    handleChange = (name) => (event) => { //higher order function
        this.setState({error: ""})
        this.setState({[name]: event.target.value});
        
    } 

    authenticate (jwt, next) {
        if(typeof window !== "undefined") {
            localStorage.setItem("jwt" , JSON.stringify(jwt))
            next(); //callback function
        }
    }

    clickSubmit = (event) => {
        event.preventDefault();

        this.setState({ loading: true })
        const {email, password} = this.state;
        const user = {
            email,
            password
        };
        signin(user)
        .then((data)=>{
            if(data.error){
                this.setState({error: data.error, loading: false})
            }else{
                //authenticate the user
                authenticate(data, () =>{
                    this.setState({
                        redirectToReferer: true
                    })
                })

            }
        })
    }


    signinForm = (email, password, loading) => {
        return (
        <form>

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

                    <p>
                        <Link to="/forgot-password" className="text-danger">
                            {" "}
                            Forgot Password?
                        </Link>
                    </p>


                    <button onClick={this.clickSubmit} className="btn btn-primary btn-block mb-4">
                        {loading ? "Loading..." : "Sign In"}
                    </button>

                    {/* <div className="text-center">
                        <p>or sign in with:</p>

                        <button type="button" className="btn btn-primary btn-floating mx-1">
                        <i className="fab fa-google"></i>
                        </button>

                    </div> */}
                </form>
            );
    }

    render(){
        const {email, password, error, redirectToReferer, loading} = this.state;
        if(redirectToReferer){
            return <Redirect to="/" />
        }
        return(
      
            <div className="container">
                <h2 className="mt-5 mb-5">Sign In Here</h2>
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>  { error } </div>

                
                {this.signinForm( email, password, loading)}

                
            </div>
        );
    }

  
}

export default Signin;