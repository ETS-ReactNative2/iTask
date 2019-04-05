/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import actions
import * as taskActions from "../taskActions";
import * as noteActions from "../../note/noteActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";

// import resource components
import TaskLayout from "../components/TaskLayout.js.jsx";
import NoteForm from "../../note/components/NoteForm.js.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);
    console.log("constructor", this.props);

    this.state = {
      showNoteForm: false,
      note: _.cloneDeep(this.props.defaultNote.obj),
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      noteFormHelpers: {}
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the task
       */
    };
    this._bind("_handleFormChange", "_handleNoteSubmit");
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchListIfNeeded("_task", match.params.taskId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj)
    });
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({ newState });
  }

  _handleNoteSubmit(e) {
    e.preventDefault();
    const { defaultNote, taskStore, userStore, dispatch, match } = this.props;
    const selectedTask = taskStore.selected.getItem();
    let newNote = { ...this.state.note };
    newNote._flow = match.params.flowId;
    newNote._task = selectedTask._id;
    newNote._user = userStore._id;
    console.log("TCL: SingleTask -> _handleNoteSubmit -> newNote", newNote);

    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      if (noteRes.success) {
        dispatch(noteActions.invalidateList("_flow", match.params.flowId));
        this.setState({
          showNoteForm: false,
          note: _.cloneDeep(defaultNote.obj)
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { taskStore } = this.props;
    const { showNoteForm, note, formHelpers } = this.state;
    console.log("This Props in render()", this.props);
    console.log("This State in render()", this.state);

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;

    const isNewNoteEmpty = !note;
    console.log("showNoteForm", showNoteForm, isNewNoteEmpty, note, !note);

    return (
      <TaskLayout>
        <h3> Single Task </h3>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> {selectedTask.name}</h1>
            <hr />
            <p> {selectedTask.description}</p>
            <br />
            <Link to={`${this.props.match.url}/update`}> Update Task </Link>

            {!isNewNoteEmpty && showNoteForm ? (
              <div>
                <NoteForm
                  note={note}
                  cancelAction={() =>
                    this.setState({
                      showNoteForm: false,
                      note: _.cloneDeep(defaultNote.obj)
                    })
                  }
                  formHelpers={formHelpers}
                  formTitle="Create Note"
                  formType="create"
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleNoteSubmit}
                />
              </div>
            ) : (
              <div>
                <button
                  className="yt-btn"
                  onClick={() => {
                    console.log(" Where is it");
                    this.setState({ showNoteForm: true });
                  }}
                >
                  Add new Note
                </button>
              </div>
            )}
          </div>
        )}
      </TaskLayout>
    );
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStoreToProps = store => {
  /**
   * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
   * differentiated from the React component's internal state
   */
  console.log("TCL: store", store);

  return {
    taskStore: store.task,
    noteStore: store.note,
    userStore: store.user.loggedIn.user,
    defaultNote: store.note.defaultItem
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
