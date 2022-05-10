import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { MainContext } from './components/Context';

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

setupIonicReact();

const App: React.FC = () => {
  
  const [selectedShop, setSelectedShop] = React.useState<number>();
  const rootURL = "https://orderhere.herokuapp.com";
  const data:any = {
    selectedShop,
    setSelectedShop,
    rootURL
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

          <Route exact path="/">
            <Redirect to="/shops" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    </MainContext.Provider>
  )
};

export default App;
