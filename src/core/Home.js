import React from "react";
import Posts from '../post/Posts';
const Home = () => {
    return(
      <div>
        {/* <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4">Home</h1>
            <p class="lead">Welcome to the Frontend</p>
          </div>
        </div> */}
        <div className="container">
          <Posts />
        </div>
      </div>
    );
  
}

export default Home;