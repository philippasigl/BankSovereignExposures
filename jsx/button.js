import React from 'react';

class ShowcaseButton extends React.Component {
  render() {
    const {buttonContent, onClick} = this.props;
    return (
      <button
        className="showcase-button"
        onClick={onClick}>
        {buttonContent}
      </button>
    );
  }
}


export default ShowcaseButton;