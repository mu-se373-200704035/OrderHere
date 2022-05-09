import "./OrderSlider.css"
//components
import OrderItem from "./OrderItem";


export default function OrderSlider(props: any){
    const {orders, setOrders} = props;


    

    return(
        <section className="order-slider">
            <h2 className="title">ORDER SLIDER</h2>
            <OrderItem />
        </section>
    )
}