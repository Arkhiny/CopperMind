import React from "react";
import { FaTrash } from "react-icons/fa";
import "../css/styles.css";

class Note extends React.Component {
  handleClick = () => {
    this.props.onDelete(this.props.id);
  };

  render() {
    return (
      <div className="note">
        <h1 className="title">{this.props.title}</h1>
        <p className="content">{this.props.content}</p>
        <button className="deleteButton" onClick={this.handleClick}>
          <FaTrash />
        </button>
      </div>
    );
  }
}

export default Note;