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

// import other libraries
import moment from "moment";

// import actions
import * as taskActions from "../taskActions";
import * as noteActions from "../../note/noteActions";

// import global components
import Binder from "../../../global/components/Binder.js.jsx";
import { CheckboxInput } from "../../../global/components/forms";

// import resource components
import TaskLayout from "../components/TaskLayout.js.jsx";
import NoteForm from "../../note/components/NoteForm.js.jsx";

class SingleTask extends Binder {
  constructor(props) {
    super(props);

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
    dispatch(noteActions.fetchListIfNeeded("_task", match.params.taskId));
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
    newNote._flow = selectedTask._flow;
    newNote._task = selectedTask._id;
    newNote._user = userStore._id;

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
    const { showNoteForm, note, formHelpers } = this.state;
    const {
      defaultNote,
      noteStore,
      userStore,
      match,
      taskStore,
      dispatch
    } = this.props;
    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    // get the taskList meta info here so we can reference 'isFetching'
    const noteList =
      noteStore.lists && noteStore.lists._task
        ? noteStore.lists._task[match.params.taskId]
        : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual note objetcs
     */
    const noteListItems = noteStore.util.getList("_task", match.params.taskId);

    const isEmpty =
      !selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

    const isFetching = taskStore.selected.isFetching;
    const isNoteListEmpty = !noteListItems || !noteList;
    const isNoteListFetching =
      !noteListItems || !noteList || noteList.isFetching;

    const isNewNoteEmpty = !note;
    const isAdmin = userStore.roles && userStore.roles.indexOf("admin") >= 0;

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
            <h1>
              {selectedTask.name}
              <CheckboxInput
                label={selectedTask.name}
                name={selectedTask.name}
                value={selectedTask.complete}
                change={event => {
                  selectedTask.complete = event.target.checked;
                  if (selectedTask.complete) {
                    selectedTask.status = "awaiting_approval";
                  }
                  dispatch(taskActions.sendUpdateTask(selectedTask));
                }}
              />
            </h1>

            {isAdmin &&
              selectedTask.complete &&
              selectedTask.status === "awaiting_approval" && (
                <div>
                  <span
                    className="yt-btn fowler x-small "
                    onClick={() => {
                      selectedTask.status = "approved";
                      dispatch(taskActions.sendUpdateTask(selectedTask));
                    }}
                  >
                    Approve
                  </span>
                  &nbsp;
                  <span
                    className="yt-btn x-small"
                    onClick={() => {
                      selectedTask.status = "open";
                      selectedTask.complete = false;
                      dispatch(taskActions.sendUpdateTask(selectedTask));
                    }}
                  >
                    Reject
                  </span>
                </div>
              )}

            <hr />
            <p> {selectedTask.description}</p>
            <br />
            <Link
              className="yt-btn x-small"
              to={`${this.props.match.url}/update`}
            >
              Edit
            </Link>

            {isNoteListEmpty ? (
              isNoteListFetching ? (
                <h3>Loading Notes...</h3>
              ) : (
                <h3>Empty.</h3>
              )
            ) : (
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                <ul>
                  {noteListItems.map((note, i) => (
                    <div key={note._id + i}>
                      <h4>
                        <i className="fa fa-user" />
                        {`  ${note.user.firstName} ${note.user.lastName}`}
                      </h4>

                      <small>
                        {moment(note.created).format("D/M/YYYY @ h:m")}
                      </small>
                      <div>{note.content}</div>
                    </div>
                  ))}
                </ul>
              </div>
            )}

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

  return {
    taskStore: store.task,
    noteStore: store.note,
    userStore: store.user.loggedIn.user,
    defaultNote: store.note.defaultItem
  };
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
