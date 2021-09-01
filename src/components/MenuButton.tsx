import React , {FunctionComponent} from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Divider } from '@material-ui/core';


interface MenuProp{
    
    menuName : string,
    isEnable : boolean,
    items : any[],
    onClickMenu : (id : string) => void,
    onClick ?: () => void
    className ?: string
}

export const MenuButton: FunctionComponent<MenuProp> = (prop) => {

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if(prop.items.length > 0){
      setOpen((prevOpen) => !prevOpen);
    }else{
      if(prop.onClick === undefined) return
      prop.onClick()
    }
  };


  const handleClose = (event: React.MouseEvent<EventTarget> , id : string) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
    prop.onClickMenu(id)
  };

    return  (
        <React.Fragment>
     
        <span
          className={prop.className}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          
          {prop.menuName}
          {prop.children}
        </span>
        
        <Popper style={{zIndex:100 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={(e)=>handleClose(e,"")}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                  {prop.items.map(item=>{
                    return (
                      <div>
                        {(item.isLine) ? (<Divider></Divider>) : ""}
                        <MenuItem disabled={!prop.isEnable} onClick={(e)=> handleClose(e,item.id)} key={prop.menuName + item.id}>{item.text}</MenuItem>
                         
                      </div>                        
                    )
                })}
                
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    )
}