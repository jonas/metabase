import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

// keep track of the order popovers were opened so we only close the last one when clicked outside
const popoverStack = [];

const ESC_KEY = 27;

export default class OnClickOutsideWrapper extends Component {
    static propTypes = {
        handleDismissal: PropTypes.func.isRequired
    };

    static defaultProps = {
        dismissOnClickOutside: true,
        dismissOnEscape: true
    };

    componentDidMount() {
        // necessary to ignore click events that fire immediately, causing modals/popovers to close prematurely
        this._timeout = setTimeout(() => {
            popoverStack.push(this);

            // HACK: set the z-index of the parent element to ensure it"s always on top
            // NOTE: this actually doesn"t seem to be working correctly for popovers since PopoverBody creates a stacking context
            ReactDOM.findDOMNode(this).parentNode.style.zIndex = popoverStack.length + 2; // HACK: add 2 to ensure it"s in front of main and nav elements

            if (this.props.dismissOnEscape) {
                document.addEventListener("keydown", this._handleKeyPress, false);
            }
            if (this.props.dismissOnClickOutside) {
                window.addEventListener("click", this._handleClick, true);
            }
        }, 0);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyPress, false);
        window.removeEventListener("click", this._handleClick, true);
        clearTimeout(this._timeout);

        // remove popover from the stack
        var index = popoverStack.indexOf(this);
        if (index >= 0) {
            popoverStack.splice(index, 1);
        }
    }

    _handleClick = (e) => {
        if (!ReactDOM.findDOMNode(this).contains(e.target)) {
            setTimeout(this._handleDismissal, 0);
        }
    }

    _handleKeyPress = (e) => {
        if (e.keyCode === ESC_KEY) {
            e.preventDefault();
            this._handleDismissal();
        }
    }

    _handleDismissal = (e) => {
        // only propagate event for the popover on top of the stack
        if (this === popoverStack[popoverStack.length - 1]) {
            this.props.handleDismissal(e);
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
