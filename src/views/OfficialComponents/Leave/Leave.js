import React from "react";
import MaterialTable from "material-table";
import Datetime from "react-datetime";
import { Redirect } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
// core components
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Check from "@material-ui/icons/Check";
//import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import Badge from "components/Badge/Badge.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import CancelOutstation from "./CancelOutstation";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import TextField from "@material-ui/core/TextField";

//Auth Components
import { useAuth } from "context/auth";

import { BaseUrl } from "variables/BaseUrl";
import { primaryColor, defaultFont } from "assets/jss/material-kit-react.js";
const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative",
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  labelRoot: {
    ...defaultFont,
    color: "#AAAAAA !important",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
    top: "10px",
    letterSpacing: "unset",
    "& + $underline": {
      marginTop: "0px",
    },
  },
  input: {
    color: "#495057",
    height: "unset",
    "&,&::placeholder": {
      fontSize: "14px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: "400",
      lineHeight: "1.42857",
      opacity: "1",
    },
    "&::placeholder": {
      color: "#AAAAAA",
    },
  },
  formControl: {
    margin: "0 0 17px 0",
    paddingTop: "27px",
    position: "relative",
    "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
      color: "#495057",
    },
  },
  underline: {
    "&:hover:not($disabled):before,&:before": {
      borderColor: "#D2D2D2 !important",
      borderWidth: "1px !important",
    },
    "&:after": {
      borderColor: primaryColor,
    },
  },
  label: {
    color: "rgba(0, 0, 0, 0.78)",
    top: "-17px",
    fontSize: "14px",
    transition: "0.3s ease all",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingLeft: "0",
    letterSpacing: "normal",
    "& + $underline": {
      marginTop: "0px",
    },
  },
};

const useStyles = makeStyles(styles);

export default function Leave() {
  const [selectedToDate, setSelectedToDate] = React.useState(new Date());
  const [selectedFromDate, setSelectedFromDate] = React.useState(new Date());

  const handleDateChangeTo = (date) => {
    setSelectedToDate(date);
  };
  const handleDateChangeFrom = (date) => {
    setSelectedFromDate(date);
  };
  const classes = useStyles();
  const { onLogin } = useAuth();

  const [isError, setIsError] = React.useState(false);
  // const { uid } = JSON.parse(localStorage.getItem("data"));
  const uid = "f20202298";
  const [stdID, setStdID] = React.useState(""); // store student's user ID, f20XXYYYY
  const token = JSON.parse(localStorage.getItem("tokens"));
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reqSent, setReqSent] = React.useState(false);
  const [sendingData, setSendingData] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [cancelId, setCancelId] = React.useState(null);
  const [isUpdated, setIsUpdated] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [outData, setOutData] = React.useState({
    from: "",
    to: "",
    uid: "",
  });
  var yesterday = Datetime.moment().subtract(1, "day");
  var validfrom = function (current) {
    return current.isAfter(yesterday);
  };

  React.useEffect(() => {
    console.log(
      `FROM: ${selectedFromDate.getFullYear()}-${
        selectedFromDate.getMonth() + 1
      }-${selectedFromDate.getDate()}`
    );

    console.log(
      `TO: ${selectedToDate.getFullYear()}-${
        selectedToDate.getMonth() + 1
      }-${selectedToDate.getDate()}`
    );
  }, [selectedToDate, selectedFromDate]);

  React.useEffect(() => {
    try {
      const fetchData = async () => {
        const result = await fetch(`${BaseUrl}/api/outstation/`, {
          headers: { Authorization: token },
        });
        const res = await result.json();
        if (res.err === false) {
          setData(
            res.data.map((info, index) => {
              let badge = null;
              if (info.approved === -1) {
                badge = <Badge color="danger">Rejected</Badge>;
              } else if (info.approved === 0) {
                badge = <Badge color="warning">Pending</Badge>;
              } else if (info.approved === 1) {
                badge = <Badge color="success">Approved</Badge>;
              }
              return {
                sno: index + 1,
                outstation_id: info.outstation_id,
                location: info.location,
                from: info.from,
                to: info.to,
                duration: `${info.duration} Days`,
                approved: badge,
                status: info.approved,
              };
            })
          );
        } else if (res.err === true && result.status === 401) {
          logout();
        }
      };
      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, [uid, token, reqSent, isUpdated]);
  React.useEffect(() => {
    if (sendingData === true) {
      setLoading(true);
      setReqSent(false);
      setIsError(false);

      try {
        const fetchData = async () => {
          const result = await fetch(`${BaseUrl}/api/o/emergency-leave`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              uid: stdID,
              token: token,
              from: `${selectedFromDate.getFullYear()}-${
                selectedFromDate.getMonth() + 1
              }-${selectedFromDate.getDate()}`,
              to: `${selectedToDate.getFullYear()}-${
                selectedToDate.getMonth() + 1
              }-${selectedToDate.getDate()}`,
              // uid: outData.uid,
            }),
          });
          const res = await result.json();
          if (res.err === false) {
            setSendingData(false);
            setOutData({
              from: "",
              to: "",
              uid: "",
              // location: "",
            });
            setReqSent(true);

            setLoading(false);
          } else if (res.err === true && result.status === 401) {
            logout();
          } else if (res.err === true && result.status === 422) {
            setErrorMsg("Empty Fields Detected");
            setIsError(true);
            setSendingData(false);
            setLoading(false);
          } else if (res.err === true) {
            setErrorMsg(res.msg);
            setIsError(true);
            setSendingData(false);
            setLoading(false);
          }
        };
        fetchData();
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    sendingData,
    // uid,
    token,
    stdID,
    selectedFromDate,
    selectedToDate,
    //outData.from,
    //outData.to,
    //outData.uid,
  ]);

  const logout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("data");
    onLogin(false);
    return <Redirect exact to="/login-page" />;
  };

  function onChange(e) {
    const { name, value } = e.target;
    setOutData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  return (
    <div>
      <div className={classes.typo} style={{ marginTop: "-50px" }}>
        <h2>
          <strong>BITS PILANI HYDERABAD CAMPUS</strong>
        </h2>
      </div>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            <b>EMERGENCY LEAVE PORTAL</b>
          </h4>
        </CardHeader>
        <CardBody>
          {reqSent ? (
            <div>
              <SnackbarContent
                message={
                  <span>
                    <b>Leave added</b>
                  </span>
                }
                close
                color="success"
                icon={Check}
              />
              <Clearfix />
            </div>
          ) : null}
          {isError ? (
            <div>
              <SnackbarContent
                message={
                  <span>
                    <b>ERROR:</b>
                    {errorMsg}
                  </span>
                }
                close
                color="danger"
                icon="info_outline"
              />
              <Clearfix />
            </div>
          ) : null}
          {/* <h3 style={{ display: "flex", justifyContent: "center" }}>
            <b>APPLY FOR OUTSTATION</b>
          </h3> */}
          <GridContainer justify="center" alignItems="center">
            <GridItem xs={12} sm={12} md={5}>
              <TextField
                id="outlined-basic"
                label="UID"
                variant="outlined"
                value={stdID}
                onChange={(e) => {
                  setStdID(e.target.value);
                }}
              />
              {/* <CustomInput
                labelText="UID"
                // helperText="Enter the ID in the format f20XXYYYY"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  multiline: true,
                  name: "uid",
                  value: outData.uid,
                }}
                onChange={onChange}
                variant="outlined"
              /> */}
            </GridItem>
            <GridItem xs={12} sm={12} md={5}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel className={classes.label}>FROM-DATE</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    // label="Date picker dialog"
                    format="dd/MM/yyyy"
                    value={selectedFromDate}
                    onChange={handleDateChangeFrom}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
                {/* <Datetime
                  dateFormat="DD-MM-YYYY"
                  timeFormat={false}
                  className={classes.input + " " + classes.underline}
                  isValidDate={validfrom}
                  value={outData.from}
                  onChange={(e) => {
                    const date = new Date(`${e}`);
                    const { Date1, Month, Year } = {
                      Date1: date.getDate(),
                      Month: date.getMonth() + 1,
                      Year: date.getFullYear(),
                    };
                    if (Month > 9) {
                      if (Date1 < 10) {
                        setOutData((prevState) => ({
                          ...prevState,
                          from: `${Year}-${Month}-0${Date1}`,
                        }));
                      } else
                        setOutData((prevState) => ({
                          ...prevState,
                          from: `${Year}-${Month}-${Date1}`,
                        }));
                    } else {
                      if (Date1 < 10)
                        setOutData((prevState) => ({
                          ...prevState,
                          from: `${Year}-0${Month}-0${Date1}`,
                        }));
                      else
                        setOutData((prevState) => ({
                          ...prevState,
                          from: `${Year}-0${Month}-${Date1}`,
                        }));
                    }
                  }}
                /> */}
              </FormControl>
            </GridItem>

            {/* <GridItem xs={12} sm={12} md={5}>
              <CustomInput
                labelText="Location of Travel"
                onChange={onChange}
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "location",
                  value: outData.location,
                }}
              />
            </GridItem> */}
            <GridItem xs={12} sm={12} md={5}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel className={classes.label}>TO-DATE</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    // label="Date picker dialog"
                    format="dd/MM/yyyy"
                    value={selectedToDate}
                    onChange={handleDateChangeTo}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
                {/* <Datetime
                  dateFormat="DD-MM-YYYY"
                  timeFormat={false}
                  className={classes.input + " " + classes.underline}
                  isValidDate={validfrom}
                  value={outData.to}
                  onChange={(e) => {
                    const date = new Date(`${e}`);
                    const { Date1, Month, Year } = {
                      Date1: date.getDate(),
                      Month: date.getMonth() + 1,
                      Year: date.getFullYear(),
                    };
                    if (Month > 9) {
                      if (Date1 < 10) {
                        setOutData((prevState) => ({
                          ...prevState,
                          to: `${Year}-${Month}-0${Date1}`,
                        }));
                      } else
                        setOutData((prevState) => ({
                          ...prevState,
                          to: `${Year}-${Month}-${Date1}`,
                        }));
                    } else {
                      if (Date1 < 10)
                        setOutData((prevState) => ({
                          ...prevState,
                          to: `${Year}-0${Month}-0${Date1}`,
                        }));
                      else
                        setOutData((prevState) => ({
                          ...prevState,
                          to: `${Year}-0${Month}-${Date1}`,
                        }));
                    }
                  }}
                /> */}
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={5}>
              <GridContainer
                direction="row"
                justify="center"
                alignItems="center"
              >
                <GridItem>
                  <Button
                    color="success"
                    disabled={loading}
                    onClick={() => {
                      setSendingData(true);
                    }}
                  >
                    Submit
                  </Button>
                  {loading ? (
                    <CircularProgress size={24} color="primary" />
                  ) : null}
                </GridItem>
              </GridContainer>
            </GridItem>
            {/* <GridItem xs={12} sm={12} md={10}>
              <p>
                <strong>Note:</strong>
                <br />
                1.You can apply for online outstation from 7 days of your Travel
                (not before that).
                <br />
                2.Incase to know the reason of rejection or for quick approval
                please contact your respective hostel warden.
                <br />
                3.Outstation request can be cancelled only if the status is{" "}
                <Badge color="warning">Pending</Badge>
              </p>
            </GridItem> */}
          </GridContainer>
          <GridContainer justify="center" alignItems="center">
            <GridItem xs={12} sm={12} md={5}>
              <h4>
                <b>Download CSV</b>
              </h4>
              <h6>
                Click on the button to download the .csv file of leaves for the
                current month
              </h6>
              <Button
                color="success"
                disabled={loading}
                // onClick={() => {
                //   setSendingData(true);
                // }}
              >
                Submit
              </Button>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CancelOutstation
          open={open}
          setOpen={setOpen}
          cancelId={cancelId}
          setIsUpdated={setIsUpdated}
        />
      </Card>
      {/* <MaterialTable
        title="PREVIOUSLY APPLIED OUTSTATIONS"
        columns={[
          { title: "S No.", field: "sno" },
          { title: "Travelling To", field: "location" },
          { title: "From Date", field: "from" },
          { title: "To Date", field: "to" },
          { title: "Duration", field: "duration" },
          { title: "Approval Status", field: "approved" },
        ]}
        data={data}
        options={{
          search: false,
          pageSize: 10,
          emptyRowsWhenPaging: false,
          actionsColumnIndex: -1,
        }}
        actions={[
          (rowData) => ({
            icon: () => (
              <Button disabled={rowData.status !== 0} color="info">
                Cancel
              </Button>
            ),
            disabled: rowData.status !== 0,
            onClick: (event, row) => {
              setCancelId(row.outstation_id);
              setOpen(true);
            },
          }),
        ]}
      /> */}
    </div>
  );
}
