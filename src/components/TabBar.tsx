import "./TabBar.css";
import { useHistory } from "react-router"
import { MainContext, useContext } from "./Context";
import DisplayIcon from "./DisplayIcon";

export default function TabBar(props: any){
    
    const {currentPageDetails, setCurrentPageDetails,} = useContext(MainContext);
    const history = useHistory();
    const gotoOrdersTab = () => {
        if(!(history.location.pathname==="/admin/orders")){
            setCurrentPageDetails((prevDetails: any)=>{
                return{
                    ...prevDetails,
                    page: "/admin/orders"
                }
            });
            history.push("/admin/orders");
        }
    }
    const gotoTablesTab = () => {
        if(!(history.location.pathname==="/admin/tables")){
            setCurrentPageDetails((prevDetails: any)=>{
                return{
                    ...prevDetails,
                    page: "/admin/tables"
                }
            });
            history.push("/admin/tables");
        }
    }
    const gotoMenuTab = () => {
        if(!(history.location.pathname==="/admin/menu")){
            setCurrentPageDetails((prevDetails: any)=>{
                return{
                    ...prevDetails,
                    page: "/admin/menu"
                }
            });
            history.push("/admin/menu");
        }
    }

    const ordersClass = props.page==="/admin/orders"  ? "tab tab-selected": "tab";
    const tablesClass = props.page==="/admin/tables"  ? "tab tab-selected": "tab";
    const menuClass   = props.page==="/admin/menu"    ? "tab tab-selected": "tab";
    return(
        <nav className="tabs">
            <div onClick={gotoOrdersTab} className={ordersClass}>
                <div className="tab-details">
                    <DisplayIcon className="tab-icon" icon="tabReceiptIcon" fill={ordersClass.includes("selected")? "var(--ion-color-light)":"var(--ion-color-dark)"} />
                    <p>Orders</p>
                </div>
            </div>
            <div onClick={gotoTablesTab} className={tablesClass}>
                <div className="tab-details">
                    <DisplayIcon className="tab-icon" icon="tableIcon" fill={tablesClass.includes("selected")? "var(--ion-color-light)":"var(--ion-color-dark)"} />
                    <p>Tables</p>
                </div>
            </div>
            <div onClick={gotoMenuTab} className={menuClass}>
                <div className="tab-details">
                    <DisplayIcon className="tab-icon" icon="menuIcon" fill={menuClass.includes("selected")? "var(--ion-color-light)":"var(--ion-color-dark)"} />
                    <p>Menu</p>
                </div>
            </div>
        </nav>
    )
}