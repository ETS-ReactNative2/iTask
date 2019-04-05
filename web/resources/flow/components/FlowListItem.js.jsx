// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FlowListItem = ({ flow }) => {
  return (
    <div>
      <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
      <div>
        {flow.tasks.map((task, index) => {
          return <div key={index}>{task.name}</div>;
        })}
      </div>
    </div>
  );
};

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
};

export default FlowListItem;
