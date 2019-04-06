// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CheckboxInput } from "../../../global/components/forms";

const FlowListItem = ({ flow }) => {
  console.log(flow);
  return (
    <div className="yt-col task">
      <h4>
        <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
      </h4>
      <div>
        {flow.tasks &&
          flow.tasks.map((task, index) => {
            return (
              <div key={index} className={`input-group`}>
                <CheckboxInput
                  label={task.name}
                  name={task.name}
                  value={task.completed}
                  change={event => {
                    console.log(event.target.checked);
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
};

export default FlowListItem;
