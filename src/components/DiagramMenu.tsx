import { FunctionComponent , useState } from "react"

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


interface DiagramMenuProp{
    diagramId ?: string,
    onClickMenu : (menu : string) => void
}

const menulist = [
    "Edit",
    "Delete",
    "Clone",
    "Make Template"
]

export const DiagramMenu: FunctionComponent<DiagramMenuProp> = ({diagramId,onClickMenu}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (opt:string) => {
      setAnchorEl(null)
      onClickMenu(opt)
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
 
      >
        {menulist.map((option:string) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={()=>handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}