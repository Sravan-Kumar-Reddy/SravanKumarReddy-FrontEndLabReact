import React from "react";
import Header from "./common/Header";
import { Route, Switch } from "react-router";
import { BrowserRouter } from 'react-router-dom';
import ShowList from "./ShowList";

import 'bootstrap/dist/css/bootstrap.min.css';
import AddExpenseItem from "./Expenses/AddExpenseItem";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/add" component={AddExpenseItem} />
                    <Route path="/" component={ShowList} />
                </Switch>
            </BrowserRouter>
        </>
    )
}

export default App;