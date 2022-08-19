import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import GridPage from "./pages/GridPage"
import SmallComponents from "./pages/SmallComponents"

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={GridPage} exact />
          <Route path="/small-components" component={SmallComponents} exact />
        </Switch>
      </Router>
    </div>
  )
}

export default App
