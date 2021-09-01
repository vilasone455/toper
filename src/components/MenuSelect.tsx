import React, { useState, FunctionComponent } from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


interface MenuListItem {
    text: string,
    id: string,
    selectOption : boolean
}

interface MenuProp {
    menuName : string
    defaultMenuText: string
    items: MenuListItem[],
    onSelectChange ?: (id : string , text : string) => void
}

export const MenuSelect: FunctionComponent<MenuProp> = ({ items, defaultMenuText , menuName , onSelectChange}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [currentSelect, setcurrentSelect] = useState("")

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (item : MenuListItem) => {
        setAnchorEl(null);
        if(item.selectOption){
            setcurrentSelect(item.text)
        }
        
        if(onSelectChange === null || onSelectChange === undefined) return 

        onSelectChange(item.id , item.text)

    };

    return (
        <React.Fragment>

            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}  endIcon={<KeyboardArrowDownIcon  />}>
                {(currentSelect === "" ) ? defaultMenuText : currentSelect }
            </Button>
            <Menu
                id={menuName}
                anchorEl={anchorEl}
                keepMounted
                elevation={0}
      
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {items.map(item=>{
                    return (
                        <MenuItem onClick={()=>handleClose(item)} key={menuName + item.id}>{item.text}</MenuItem>
                    )
                })}

            </Menu>

        </React.Fragment>

    )
}