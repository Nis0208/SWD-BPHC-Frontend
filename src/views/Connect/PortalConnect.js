import React from "react";
import MaterialTable from "material-table";
import {csv} from "d3";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";


//Core Components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


//import Table from "components/Table/Table";
import portals from "./portals.csv";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";


export default function ConnectModal(){
const classes=useStyles();
const [open,setOpen]=React.useState(false);
const [data,setData]=React.useState();
const [isFetching,setIsfetching]=React.useState(false)
const [isFetched,setIsFetched]=React.useState(false)
React.useEffect(()=>{
    
    try{
      const fetchData= async ()=>{
      setData( await csv(portals)) ;
      setIsfetching(true)        
      
      
    }
  fetchData();
 
  }catch(err){
      console.log(err);
    }
  },[])
  React.useEffect(()=>{
if(isFetching===true)
setIsFetched(true);

  },[isFetching])
  let modal=<></>
  if(isFetched===true){
    const columns1= data.columns.map(item=>{
        return {title:item, field:item}
    })
    modal=<Dialog
              classes={{
                root: classes.center,
                paper: classes.modal
              }}
              fullScreen
              fullWidth={true}
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setOpen(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <IconButton
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => setOpen(false)}
                >
                  <Close className={classes.modalClose} />
                </IconButton>
                <h3 className={classes.modalTitle}><strong>Web Portals</strong></h3>
              </DialogTitle>
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                 <MaterialTable
                  title="Every Website Linked With BITS-PILANI universe"
                  columns={columns1}
                  data={data}
                  options={{
                      search:false,
                      
                  }}
                  />           



              </DialogContent>
              <DialogActions className={classes.modalFooter}>
               
                <Button
                  onClick={() => setOpen(false)}
                  color="danger"
                  simple
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>}
    
 
    return(
        <Card>
            <CardHeader color="primary">  
               <h3 className={classes.cardTitleCon}>
                WEBSITE AND PORTALS
               </h3>
            </CardHeader>
            <CardBody>
                <p>A complete Directory of all the websites and portals linked with BITS Pilani University</p>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                <Button round color="info" onClick={()=>{setOpen(true)}}>
                  View Directory
                </Button>
                </div>
            </CardFooter>    
            {modal}      
        </Card>
    );
}