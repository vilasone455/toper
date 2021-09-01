import { Dialog } from "@material-ui/core";
import Button from '@material-ui/core/Button';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme  , withStyles} from '@material-ui/core/styles';
import { FunctionComponent, useEffect, useState } from "react";
import { Relation } from "../../interface/Relation";
import { TableData } from "../TableEditor";
import { ModalProp } from "./modalprop";
import {SeedGenerator} from '../../api/seed-generator/SeedGenerator'
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import {CardSelect} from '../modal/CardSelect'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { SeedOption } from "../../data/SeedGenerateOption";
import {saveAs} from "file-saver";
import { Field } from "../../schemanode/node/SchemaNodeModel";

interface SeedProp extends ModalProp {
    tables: TableData[]
    relations: Relation[]
}

const Accordion = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);

  const AccordionSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);
  
  const AccordionDetails = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiAccordionDetails);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);


export const SeedGeneratorModal: FunctionComponent<SeedProp> = (p) => {

    const classes = useStyles();

    const [currentSelect, setcurrentSelect] = useState("")

    const [selectSeedModal, setselectSeedModal] = useState(false)


    const onGenerate = () => {

    }

    const handleChange = (id: string | undefined) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        if(id === undefined) return 
        setcurrentSelect((currentSelect==="") ? id : "");
    }

    const onExitModal = () => {
        p.onClose()
    }

    const onConfrimSelect = () => {
        setselectSeedModal(false)
        let seedGenerate = new SeedGenerator()
        let str = seedGenerate.generate(p.tables , p.relations)
        var blob = new Blob([str], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "seed.sql");
      
    }

    return (
        <Dialog fullScreen open={p.isOpen} onClose={onExitModal} >
            <CardSelect items={SeedOption} isOpen={selectSeedModal} 
            onClose={()=>setselectSeedModal(false)} onChange={e=>setcurrentSelect(e)} onConfrim={onConfrimSelect} />
            <AppBar className={classes.appBar} elevation={0}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onExitModal} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Seed Generator
            </Typography>
                    <Button autoFocus color="inherit" onClick={()=>setselectSeedModal(true)}>
                        Save
            </Button>
            <Button autoFocus color="inherit" onClick={onExitModal}>
                        Close
            </Button>
                </Toolbar>
            </AppBar>
   
            <div>
                {p.tables.map(t => {
                    return (
                        <Accordion TransitionProps={{ unmountOnExit: true }}
                            expanded={t.id === currentSelect} onChange={handleChange(t.id)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography >{t.tablename}</Typography>
                                
                            </AccordionSummary>
                            <AccordionDetails>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Faker</th>
                                        </tr>
                                    
                                    </thead>
                                    <tbody>
                                    {t.fields.map(f=>{
                                    return (
                                        <tr>
                                            <td>{f.fieldName}</td>
                                            <td>{f.fieldType}</td>
                                            <td>{f.fieldOption?.faker}</td>
                                        </tr>
                                        
                                    )
                                })}
                                        
                                    </tbody>
                                </table>
                                
                                
                            </AccordionDetails>
                        </Accordion>
                    )
                })}


            </div>
        </Dialog>

    )
}