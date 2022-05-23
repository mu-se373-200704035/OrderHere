import "./TabBar.css";
import { useHistory } from "react-router"
import { MainContext, useContext } from "./Context";

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

    }

    const ordersClass = props.page==="/admin/orders"  ? "tab tab-selected": "tab";
    const tablesClass = props.page==="/admin/tables"  ? "tab tab-selected": "tab";
    const menuClass   = props.page==="/admin/menu"    ? "tab tab-selected": "tab";
    return(
        <nav className="tabs">
            <div onClick={gotoOrdersTab} className={ordersClass}>
                Orders
            </div>
            <div onClick={gotoTablesTab} className={tablesClass}>
                Tables
            </div>
            <div className="tab">
                Menu
            </div>
        </nav>
    )
}