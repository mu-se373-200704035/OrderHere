import { IonItem, IonList } from "@ionic/react";
import "./ShopList.css"
import { nanoid } from "nanoid";
import React from "react";
import { useHistory } from "react-router";
//components
import ShopCard from "./ShopCard";
import { MainContext, useContext } from "./Context";

export default function ShopList(props: any){
    
    const {setSelectedShop} = useContext(MainContext);

    const history = useHistory();
        const orderPage = (id:number) => {
            history.push("/order");
            setSelectedShop(id);
        }

    const shopCards = props.shops.map(function(shop:any){
        
        return(
                <IonItem key={nanoid()}
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
            <IonList lines="none">
                {shopCards}
            </IonList>
        </section>
    )
}