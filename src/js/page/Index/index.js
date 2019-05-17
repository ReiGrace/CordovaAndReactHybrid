import './index.less';
import PropTypes from 'prop-types';


class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            pages: [this.props.page]
        }
        //保存页面属性
        this.pageOfProps = {
            0: null
        }
    }
    static contextTypes = {
        refs: PropTypes.object.isRequired
    }

    componentWillMount() {
        this.context.refs['router'] = this;
    }

    // componentDidMount() {
    //     this.context.refs['router'] = this;
    // }

    push = (element, props) => {
        let routeDom = this.refs['route'];

        this.state.pages.push(element);
        this.pageOfProps[this.state.current + 1] = props || {};

        this.setState({
            pages: this.state.pages,
            current: this.state.current + 1
        });
    }

    pop = (count) => {
        if (typeof count == 'number' && count > 1) {
            let current = this.state.current;

            while (count > 0) {
                this.state.pages.pop();
                this.pageOfProps[this.state.current] = null;
                delete this.pageOfProps[this.state.current];

                current = current - 1;
                count = count - 1;
            }

            this.setState({
                current: current
            });
        } else {
            this.state.pages.pop();
            this.pageOfProps[this.state.current] = null;
            delete this.pageOfProps[this.state.current];

            this.setState({
                current: this.state.current - 1
            });
        }
    }

    login = () => {
        let current = this.state.current;

        while (this.state.pages.length > 1) {
            this.state.pages.pop();
            this.pageOfProps[this.state.current] = null;
            delete this.pageOfProps[this.state.current];

            current = current - 1;
        }

        this.setState({
            current: current
        });
    }

    render() {
        let htmlArr = [];
        for (let index = 0; index < this.state.pages.length; index++) {
            const element = this.state.pages[index];

            let offset = (index - this.state.current) * (window.screen.width);
            let propsTo = this.pageOfProps[index];

            htmlArr.push(
                <RouterPage key={index} index={index} left={offset} >
                    {React.createElement(element, {
                        ...propsTo
                    })}
                </RouterPage>
            );

        }

        return (
            <div className="route-index" ref="route" style={{
                left: this.state.leftOffset
            }}>
                {htmlArr}
            </div>
        )
    }
}

class RouterPage extends React.Component {
    render() {
        return (
            <div className='route-page' style={{ width: window.screen.width, left: this.props.left }} >
                {this.props.children}
            </div>
        )
    }
}


export default Router;