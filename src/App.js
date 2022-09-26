import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import GridPage from "./pages/GridPage"
import SideBar from "./pages/sidebar/SideBar"
import SmallComponents from "./pages/SmallComponents"

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={GridPage} exact />
          <Route path="/small-components" component={SmallComponents} exact />
          <Route path="/sidebar" component={SideBar} exact />
        </Switch>
      </Router>
    </div>
  )
}

export default App
