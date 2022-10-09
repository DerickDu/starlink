import React, { Component } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import {
  BASE_URL,
  NEARBY_SATELLITE,
  SAT_API_KEY,
  STARLINK_CATEGORY,
} from "../constants";
import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      setting: {},
      satInfo: {},
      satList: [],
      isLoadingList: false,
    };
  }
  render() {
    const { isLoadingList, satInfo, satList, setting } = this.state;
    return (
      <Row className="main">
        <Col span={8} className="left-side">
          <SatSetting onShow={this.showNearbySatellite} />
          <SatelliteList
            isLoad={isLoadingList}
            satInfo={satInfo}
            onShowMap={this.showMap}
          />
        </Col>
        <Col span={16} className="right-side">
          <WorldMap satData={satList} observerData={setting} />
        </Col>
      </Row>
    );
  }

  showMap = (selected) => {
    this.setState((preState) => ({
      // setState的第二种写法，左边括号里的是旧的state，右边的是新的state
      ...preState,
      satList: [...selected],
    }));
    //  this.setState( 等于
    //   satList: selected
    // )
  };

  showNearbySatellite = (setting) => {
    this.setState({
      isLoadingList: true,
      setting: setting,
    });
    this.fetchSatellite(setting);
  };

  fetchSatellite = (setting) => {
    const { latitude, longitude, elevation, altitude } = setting;
    const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

    this.setState({
      isLoadingList: true,
    });

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        this.setState({
          satInfo: response.data,
          isLoadingList: false,
        });
      })
      .catch((error) => {
        console.log("err in fetch satellite -> ", error);
      });
  };
}
export default Main;
