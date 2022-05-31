import "./Root.css";
import { IonContent, IonPage,} from '@ionic/react';
import { useHistory } from 'react-router';
import { MainContext, useContext } from '../components/Context';
const Root = () => {
    
    const history = useHistory();
    const {setCurrentPageDetails} = useContext(MainContext); 
    
    const gotoShops =  ()=>{
        setCurrentPageDetails((prev: any)=>{
            return{
                ...prev,
                page: "/shops"
            }
        }); 
        history.push("/shops") 
    }
    const gotoAdminOrders =  ()=>{
        setCurrentPageDetails((prev: any)=>{
            return{
                ...prev,
                page: "/admin/orders"
            }
        });
        history.push("/admin/orders");
    }

    return (
        <IonPage>
          <IonContent className="font-inter" fullscreen>
            <section onClick={gotoShops} className="root customer">
                <h1>I am a customer</h1>
            </section>


            <section onClick={gotoAdminOrders}className="root employee">
                <h1>I am an employee</h1>
            </section>
          </IonContent>
        </IonPage>
    )
}
export default Root;