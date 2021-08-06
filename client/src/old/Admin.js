import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Redirect } from "react-router";
import "../styles/adminTable.css";
import Navbar from "../utils/SciNavbar.js";

const { SearchBar } = Search;

class Admin extends Component {
  constructor(props, context) {
    super(props, context);

    console.log(props);

    this.handleShowAdd = this.handleShowAdd.bind(this);
    this.handleCloseAdd = this.handleCloseAdd.bind(this);
    this.handleShowMinus = this.handleShowMinus.bind(this);
    this.handleCloseMinus = this.handleCloseMinus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.redirect = this.redirect.bind(this);
    this.hourTypeHandler = this.hourTypeHandler.bind(this);

    this.state = {
      redirect: false,
      show: false,
      show2: false,
      modify_num: "",
      hours: 0,
      row: [],
      users: [],
      selectedUser: {},
      admin: null,
      loaded: false,
      finalHours: 0,
      regularHours: 0,
    };
  }

  handleCloseAdd() {
    this.changeCSS();
    this.setState({
      show: false,
      hours: 0,
    });
  }

  handleShowAdd(e) {
    this.changeCSS();
    console.log(e);
    this.setState({ show: true });
  }

  handleCloseMinus() {
    this.changeCSS();
    this.setState({ show2: false });
  }
  handleShowMinus() {
    this.changeCSS();
    this.setState({ show2: true });
  }

  handleSubmit(ref) {
    if (
      (this.state.finalHours && !this.state.regularHours) ||
      (!this.state.finalHours && this.state.regularHours)
    ) {
      let axiosBody = {
        stu_no: ref.state.modify_num,
        hourType: ref.state.finalHours ? 1 : 0,
        value: ref.state.hours,
      };

      axios
        .post("/api/change-hours", axiosBody)
        .then((res) => {
          if (res.data.success) {
            let replacementUsers = this.state.users;
            for (let i = 0; i < this.state.users.length; i++) {
              let tempUser = this.state.users[i];
              if (tempUser.stu_no === axiosBody.stu_no) {
                if (axiosBody.hourType === 1) {
                  replacementUsers[i].time_final = (
                    parseFloat(replacementUsers[i].time_final) +
                    parseFloat(axiosBody.value)
                  ).toFixed(2);
                  console.log(replacementUsers[i].time_final);
                } else {
                  replacementUsers[i].time_reg = (
                    parseFloat(replacementUsers[i].time_reg) +
                    parseFloat(axiosBody.value)
                  ).toFixed(2);
                  console.log(replacementUsers[i].time_reg);
                }
              }
            }

            this.setState({
              users: replacementUsers,
            });

            ref.handleCloseAdd();
          } else {
            alert("error, contact it");
            console.log(res);
            ref.handleCloseAdd();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("error, contact it");
          ref.handleCloseAdd();
        });
    } else {
      alert("Please select hour type.");
    }
  }

  handleChange(event) {
    this.setState({ hours: event.target.value });
  }

  loadData(accept, reject) {
    axios
      .get("/api/refresh")
      .then((res) => {
        if (res.data && res.data.userLevel === 0) {
          console.log(res.data);
          accept(res);
        } else {
          // throw "Bad Response, Contact Support";
        }
      })
      .catch(() => {
        reject();
      });
  }

  hourTypeHandler(e) {
    if (e.target.name === "regularHours")
      this.setState({
        regularHours: !this.state.regularHours,
        finalHours: 0,
      });
    else
      this.setState({
        regularHours: 0,
        finalHours: !this.state.finalHours,
      });
  }

  redirect() {
    this.setState({ redirect: true });
  }

  componentDidMount() {
    this.changeCSS();
    let success = (res) => {
      // runs on success
      console.log(res.data.data);
      this.setState({
        users: res.data.data,
        admin: res.data.user,
        loaded: true,
      });

      console.log(this.state.users);
    };

    let failure = () => {
      this.setState({ redirect: true });
    };

    if (!this.props.location.state) {
      this.loadData(success, failure);
    } else {
      this.setState({
        users: this.props.location.state.data,
        admin: this.props.location.state.user,
        loaded: true,
      });
    }
  }

  render() {
    const add_delete = (cell, row) => {
      //this.setState({modify_num:row.stu_no});
      return (
        <div className="center">
          <div>
            <i
              className="fas fa-pencil-alt icon"
              onClick={() => {
                this.handleShowAdd(row);
              }}
              value={row.stu_no}
            ></i>
          </div>
        </div>
      );
    };

    const columns = [
      {
        dataField: "fname",
        text: "First Name",
      },
      {
        dataField: "lname",
        text: "Last Name",
      },
      {
        dataField: "email",
        text: "Email",
      },
      {
        dataField: "stu_no",
        text: "Student Number",
      },
      {
        dataField: "time_reg",
        text: "Regular Hours Completed",
      },
      {
        dataField: "req_time_reg",
        text: "Regular Hours Required",
      },
      {
        dataField: "time_final",
        text: "Final Hours Completed",
      },
      {
        dataField: "req_time_final",
        text: "Final Hours Required",
      },
      {
        dataField: "location",
        text: "Location",
      },
      {
        dataField: "modify",
        text: "Modify",
        formatter: add_delete,
        editable: false,
      },
    ];

    return this.state.redirect ? (
      <Redirect
        push
        to={{
          pathname: "/login-admin",
        }}
      />
    ) : this.state.loaded ? (
      <div className="App">
        <Navbar user={this.state.admin} redirect={this.redirect} />{" "}
        {/* Our Special imported navbar with logout functionality */}
        <Modal show={this.state.show} onHide={this.handleCloseAdd} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Edit Hours of{" "}
              {this.state.selectedUser.fname +
                " " +
                this.state.selectedUser.lname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="input input--kohana inline">
                <input
                  className="input__field input__field--kohana"
                  type="text"
                  id="hours"
                  name="hours"
                  onChange={this.handleChange}
                />
                <label
                  className="input__label input__label--kohana"
                  for="input-3"
                >
                  <i className="fas fa-fw fa-crown icon-c icon--kohana"></i>
                  <span className="input__label-content input__label-content--kohana">
                    <i className="fas fa-crown"></i>&nbsp;&nbsp;&nbsp;&nbsp;Add
                    Hours
                  </span>
                </label>
              </div>
              <div className="inline admin-math">
                {this.state.regularHours ? (
                  <div>
                    + {this.state.selectedUser.time_reg} ={" "}
                    {Number(
                      !isNaN(this.state.hours) && this.state.hours !== ""
                        ? Number(this.state.hours) +
                            Number(this.state.selectedUser.time_reg)
                        : this.state.selectedUser.time_reg
                    ).toFixed(2)}{" "}
                    / {this.state.selectedUser.req_time_reg} Regular Hours
                  </div>
                ) : this.state.finalHours ? (
                  <div>
                    + {this.state.selectedUser.time_final} ={" "}
                    {Number(
                      !isNaN(this.state.hours) && this.state.hours !== ""
                        ? Number(this.state.hours) +
                            Number(this.state.selectedUser.time_final)
                        : this.state.selectedUser.time_final
                    ).toFixed(2)}{" "}
                    / {this.state.selectedUser.req_time_final} Final Hours
                  </div>
                ) : (
                  <div>Select an hour type</div>
                )}
              </div>
              <div className="checkbox-container">
                <div className="inline">
                  Hour Type: regular&nbsp;
                  <input
                    onClick={this.hourTypeHandler}
                    checked={this.state.regularHours}
                    type="checkbox"
                    name="regularHours"
                  />
                  &nbsp;or final&nbsp;
                  <input
                    onClick={this.hourTypeHandler}
                    checked={this.state.finalHours}
                    type="checkbox"
                    name="finalHours"
                  />
                </div>
              </div>

              <button
                className="btn btn-success"
                checked={this.state.finalHours}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSubmit(this);
                }}
              >
                Add
              </button>
            </form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        <Row className="topSpaceL">
          <Col md={1}></Col>
          <Col md={6}>
            <h5>
              Welcome to the admin panel. Please search with the input below and
              edit hours with the corresponding User's pencil
            </h5>
          </Col>
        </Row>
        <Row>
          <Col md={1}></Col>
          <Col md={10}>
            <ToolkitProvider
              keyField="stu_no"
              data={this.state.users}
              columns={columns}
              search
            >
              {(props) => (
                <div>
                  <SearchBar
                    className=""
                    placeholder=" "
                    {...props.searchProps}
                    id="input-23"
                  />

                  {/* <BootstrapTable id="admin-table" pagination={paginationFactory()} rowEvents={rowEvents}
                          {...props.baseProps} hover filter={filterFactory()}
                        /> */}
                </div>
              )}
            </ToolkitProvider>
          </Col>
          <Col md={1}></Col>
        </Row>
      </div>
    ) : (
      <div>
      </div>
    );
  }
}

export default Admin;
