
class XyIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type || { default: {} },
            size: props.size || 'md',
            className: props.className || '',
        }
    }
    render() {
        const { type, size, className } = this.state;

        return (
            <svg
                {...this.props}
                className={`am-icon am-icon-${type.default.id} am-icon-${size} ${className}`}
            >
                <use xlinkHref={`#${type.default.id}`} />
            </svg>
        );
    }
}

export default XyIcon;