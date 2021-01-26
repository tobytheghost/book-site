import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import Product from "./views/Product/Product";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./stylesheets/main.scss";
import "./App.scss";

const DemoBook = () => {
  const history = useHistory();

  history.push("/products/9780060577315");

  return null;
};

const App = () => {
  return (
    <div className="app">
      {/* <Header /> */}
      <main>
        <Router>
          <Switch>
            <Route path="/products/:productId" exact component={Product} />
            <Route component={DemoBook} />
          </Switch>
        </Router>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
