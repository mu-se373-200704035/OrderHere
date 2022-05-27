import "./ShopCard.css"

export default function ShopCard(props:any){
    
    return(
        <section className="shop-card">
            <h2 className="shop-name">
                {props.name}
            </h2>
        </section>
    )
}