import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter"; 

const App = () => {

    return(
        <BrowserRouter basename={`${process.env.REACT_APP_BASE_URL}`}>
            <MainRouter />
        </BrowserRouter>
    );

}

export default App;