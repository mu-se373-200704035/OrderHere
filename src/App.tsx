import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useState } from 'react';
import { MainContext } from './components/Context';
import IItem from "./interfaces/IItem";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Shops from './pages/Shops';
import Order from './pages/Order';
import IPageDetails from './interfaces/IPageDetails';
import AdminOrders from './pages/AdminOrders';
import Register from './pages/Register';
import Login from './pages/Login';
import Root from './pages/Root';
import ISession from './interfaces/ISession';
import AdminTables from './pages/AdminTables';
import TableDetails from './pages/TableDetails';

setupIonicReact();

const App: React.FC = () => {
  
  const [currentOrderItems, setCurrentOrderItems] = useState<IItem[]>([]);
  const [currentPageDetails, setCurrentPageDetails] = useState<IPageDetails>();
  const [currentTableInfo, setCurrentTableInfo] = useState<any>();
  const rootURL = "http://localhost:3000";
  const axios = require("axios").default;
  const [session, setSession] = useState<ISession>();
  const [headers, setHeaders] = useState<ISession>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>();
  const [tables, setTables] = useState<any>();

  
  const data:any = {
    rootURL,
    axios,
    currentOrderItems,  setCurrentOrderItems,
    currentPageDetails, setCurrentPageDetails,
    currentTableInfo,   setCurrentTableInfo,
    session,            setSession,
    headers,            setHeaders,
    loggedIn,           setLoggedIn,
    selectedTab,        setSelectedTab,
    tables,             setTables,
  }

  return(
    <MainContext.Provider value={data}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          
          <Route exact path="/shops">
            <Shops />
          </Route>

          <Route exact path="/order">
            <Order />
          </Route>
          
          <Route exact path="/admin/orders">
            <AdminOrders />
          </Route>
          
          <Route exact path="/admin/tables">
            <AdminTables />
          </Route>
          
          <Route exact path="/admin/tables/details">
            <TableDetails />
          </Route>

          <Route exact path="/register">
            <Register />
          </Route>
          
          <Route exact path="/login">
            <Login />
          </Route>
          
          <Route exact path="/welcome">
            <Root />
          </Route>

          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    </MainContext.Provider>
  )
};

export default App;
