import PropTypes from 'prop-types';
import { Children } from 'react';

class RefProvider extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.comRefs = props.refs;
    }

    getChildContext() {
        return {
            refs: this.comRefs
        }
    }

    render() {
        return Children.only(this.props.children);
    }
}

RefProvider.propTypes = {
    refs: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
}

RefProvider.childContextTypes = {
    refs: PropTypes.object.isRequired
}

export default RefProvider;

