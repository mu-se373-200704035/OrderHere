import { createContext, useContext } from "react";
import { Context } from "vm";

const MainContext = createContext<any | null>(null);

export{
    MainContext,
    useContext
}