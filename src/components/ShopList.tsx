import { IonItem, IonList } from "@ionic/react";
import "./ShopList.css"
import { nanoid } from "nanoid";
import { useHistory } from "react-router";
//components
import ShopCard from "./ShopCard";
import { MainContext, useContext } from "./Context";

export default function ShopList(props: any){
    
    const {setCurrentPageDetails} = useContext(MainContext);

    const history = useHistory();
        const orderPage = (id:number) => {
            history.push("/order");
            setCurrentPageDetails((prevState: any)=>{
                return{
                    ...prevState,
                    shop_id: id,
                    page: "/order"
                }
            });
        }

    const shopCards = props.shops.map(function(shop:any){
        
        return(
                <IonItem className="item-dark" key={nanoid()}
                    onClick={() => orderPage(shop.id)}>
                    <ShopCard
                        id={shop.id}
                        name={shop.name}
                        pic_url={shop.pic_url}
                        />
                </IonItem>
        )
    })

    return(
        <section>
            <h1 className="shop-list-title">{ props.title }</h1>
            <IonList className="list-dark" lines="none">
                {shopCards}
            </IonList>
        </section>
    )
}