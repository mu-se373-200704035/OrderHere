import "./Item.css";
import { MainContext, useContext } from "./Context";
export default function Item(props: any){
    
    const {id, name, price, description, quantity ,items} = props; 
    
    
    const {currentOrderItems, setCurrentOrderItems} = useContext(MainContext);
    const theItem = currentOrderItems.find((item: any)=> {
        if(item)
            return item.id === id
    });
    const shouldShowControls = () => {
        if(theItem){
            return theItem.quantity>0
        }
    }
    const shouldRenderControls = shouldShowControls(); 

    const onItemClick = (id: number) => {
        if(!theItem || theItem.quantity < 1){
            const newItem = {
                ...items.find((item: any)=>item.id===id),
                quantity: 1
            }
                setCurrentOrderItems((prevOrders: any) => {
                return [
                    ...prevOrders,
                    newItem
                ]
            })
        }
    }
    const onIncrement = (id:number)=>{
        const newOrders = currentOrderItems.map((item: any)=>{
            if (item.id!==id){
                return item;
            }else{
                return {
                    ...item,
                    quantity: item.quantity+1
                }
            }
        })
        setCurrentOrderItems(newOrders);
    }
    const onDecrement = (id: number)=>{
        const newOrders = currentOrderItems.reduce((result:any[], item: any)=>{
            if (item && item.id!==id){
                result.push(item);
            }else{
                if(item && item.quantity>1){
                    result.push({
                        ...item,
                        quantity: item.quantity-1
                    })
                }
            }
            return result;
        },[])
        setCurrentOrderItems(newOrders);
    }

    return(
        <section className="item-wrapper" onClick={()=>{onItemClick(id)}}>
            <div className="item-topline">
                <h3 className="item-name">{name}</h3>
                {shouldRenderControls &&
                <div className="controls-wrapper">
                    <div className="control-btn decrement" onClick={()=>{onDecrement(id)}} >
                        -
                    </div>
                    x{theItem && theItem.quantity}  
                    <div className="control-btn increment" onClick={()=>onIncrement(id)}>
                        +
                    </div>    
                </div>}
                <h3 className="item-price">{price}</h3>
            </div>
            {description && <h4 className="item-desc">{description}</h4>}
        </section>
    )
}