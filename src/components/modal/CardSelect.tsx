import { FunctionComponent , useState } from "react";
import { ModalProp , DialogContent , DialogActions } from "./modalprop";
import { Button , Dialog, DialogTitle } from "@material-ui/core"
interface CartSelectProp extends ModalProp{
    items : any[],
    onChange : (title:string) => void,
    onConfrim : () => void
}

const CardItem : FunctionComponent<{item:any,isSelect:boolean,onSelectItem:(name:string)=>void}> = ({item,isSelect,onSelectItem}) => {

    const onSelect = () => {
        onSelectItem(item.title)
    }

    const bgColor = () => {
        let rs = (isSelect) ? "blue" : "white"
        return rs
    }

    return (
        <div onClick={onSelect} style={{backgroundColor:bgColor()}}>
            <div>{item.title}</div>
            <div>{item.icon}</div>
            <div>{item.description}</div>
        </div>
    )
}

export const CardSelect : FunctionComponent<CartSelectProp> = (p) => {

    const [currentSelect, setcurrentSelect] = useState("")

    const onSelectCard = (title : string) => {
        setcurrentSelect(title)
        p.onChange(title)
    }

    const onConfrimSelect = () => p.onConfrim()

    const onCloseSelect = () => p.onClose()

    return (
        <Dialog open={p.isOpen}>
             <DialogTitle>Select Seed Type</DialogTitle>
             <DialogContent dividers>
                <div className="container">
                    {p.items.map(item=>{
                        return (<CardItem item={item} onSelectItem={onSelectCard} 
                            isSelect={(currentSelect === item.title)} />)
                    })}
                </div>
             </DialogContent>
             <DialogActions>
                <Button onClick={onConfrimSelect}>Select</Button>
                <Button onClick={onCloseSelect}>Close</Button>
             </DialogActions>
        </Dialog>
    )
}

