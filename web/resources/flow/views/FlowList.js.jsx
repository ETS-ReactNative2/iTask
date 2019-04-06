/**
 * View component for /flows
 *
 * Generic flow list view. Defaults to 'all' with:
 * this.props.dispatch(flowActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as flowActions from "../flowActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import FlowLayout from "../components/FlowLayout.js.jsx";
import FlowListItem from "../components/FlowListItem.js.jsx";

class FlowList extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch a list of your choice
    this.props.dispatch(flowActions.fetchListIfNeeded("all")); // defaults to 'all'
    console.log("TCL: FlowList -> componentDidMount");
  }

  componentWillReceiveProps() {
    this.props.dispatch(flowActions.fetchListIfNeeded("all")); // defaults to 'all'
  }

  render() {
    const { flowStore } = this.props;

    /**
     * Retrieve the list information and the list items for the component here.
     *
     * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
     * these steps within the mapStoreToProps method prior to delivering the
     * props to the component.  Othwerwise, the render() action gets convoluted
     * and potentially severely bogged down.
     */

    // get the flowList meta info here so we can reference 'isFetching'
    const flowList = flowStore.lists ? flowStore.lists.all : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual flow objetcs
     */
    const flowListItems = flowStore.util.getList("all");

    /**
     * NOTE: isEmpty is is usefull when the component references more than one
     * resource list.
     */
    const isEmpty = !flowListItems || !flowList;

    const isFetching = !flowListItems || !flowList || flowList.isFetching;

    const FetchingComponent = () =>
      isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>;

    return (
      <FlowLayout>
        <div className={`topbar center`}>
          <h1> Flows </h1>
          <Link to={"/flows/new"} className="yt-btn">
            New Flow
          </Link>
        </div>
        <br />
        {isEmpty ? (
          <FetchingComponent />
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <div className="yt-row">
              {flowListItems.map((flow, i) => (
                <FlowListItem key={flow._id + i} flow={flow} />
              ))}
            </div>
          </div>
        )}
      </FlowLayout>
    );
  }
}

FlowList.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStoreToProps = store => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  return {
    flowStore: store.flow
  };
};

export default withRouter(connect(mapStoreToProps)(FlowList));
