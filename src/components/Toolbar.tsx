import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';
import FileCopy from '@material-ui/icons/FileCopy';
import MenuItem from '@material-ui/core/MenuItem';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import LaunchIcon from '@material-ui/icons/Launch';
import PrintIcon from '@material-ui/icons/Print';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import DeleteIcon from '@material-ui/icons/Delete';
import TableChartIcon from '@material-ui/icons/TableChart';
import Select from '@material-ui/core/Select';
import SelectInput from '@material-ui/core/Select/SelectInput';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      '& svg': {
        margin: theme.spacing(1.0),
      },
      '& hr': {
        margin: theme.spacing(0, 0.5),
      },
    },
  }),
);

export default function VerticalDividers() {
  const classes = useStyles();

  return (
    <div>
      <Grid container alignItems="center" className={classes.root}>
          <TableChartIcon></TableChartIcon>
          <LaunchIcon></LaunchIcon>
          <FileCopy></FileCopy>
          <PrintIcon></PrintIcon>
          <Divider orientation="vertical" flexItem />
        <Redo />
        <Undo />
        <Divider orientation="vertical" flexItem />
        <Select>
        <MenuItem value={"50%"}>50%</MenuItem>
          <MenuItem value={"75%"}>75%</MenuItem>
          <MenuItem value={"100%"}>100%</MenuItem>
        </Select>
        <ZoomInIcon />
        <ZoomOutIcon />
        <Divider orientation="vertical" flexItem />
        <BookmarksIcon></BookmarksIcon>
        <DeleteIcon></DeleteIcon>
      </Grid>
    </div>
  );
}