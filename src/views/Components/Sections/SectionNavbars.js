import React from "react";

import "../../../assets/css/count.css";

const zerofill = num => (num < 10 && num >= 0 ? `0${num}` : num);

const SvgCircle = props => {
  const { className, done, max, radius, stroke, strokeWidth } = props;
  const size = (radius + strokeWidth) * 2;
  const length = Math.ceil(2 * radius * Math.PI);
  const remainingLength =
    length - Math.ceil(2 * radius * Math.PI) * (done / max);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle
          className="circle"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          stroke={stroke}
          strokeDasharray={length}
          strokeDashoffset={remainingLength}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="circle--bg"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          stroke="rgba(0, 0, 0, .1)"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          fill="none"
        />
      </g>
    </svg>
  );
};

SvgCircle.defaultProps = {
  done: 0,
  max: 24,
  radius: 72,
  stroke: "#e91e63",
  strokeWidth: 8
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  componentWillMount() {
    this.getTimeUntil(this.props.deadline);
  }
  componentDidMount() {
    this.timerId = setInterval(
      () => this.getTimeUntil(this.props.deadline),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    this.setState({ days, hours, minutes, seconds });
  }
  render() {
    return (
      <div className="clock">
        <div className="clock__display">
          <SvgCircle
            className="clock__circle"
            max={365}
            done={this.state.days}
          />
          <div className="clock__text clock__text--days">
            <span className="clock__amount">{zerofill(this.state.days)}</span>
            <span className="clock__unit">days</span>
          </div>
        </div>
        <div className="clock__display">
          <SvgCircle max={24} done={this.state.hours} />
          <div className="clock__text clock__text--hours">
            <span className="clock__amount">{zerofill(this.state.hours)}</span>
            <span className="clock__unit">hours</span>
          </div>
        </div>
        <div className="clock__display">
          <SvgCircle max={60} done={this.state.minutes} />
          <div className="clock__text clock__text--minutes">
            <span className="clock__amount">
              {zerofill(this.state.minutes)}
            </span>
            <span className="clock__unit">minutes</span>
          </div>
        </div>
        <div className="clock__display">
          <SvgCircle max={60} done={this.state.seconds} />
          <div className="clock__text clock__text--seconds">
            <span className="clock__amount">
              {zerofill(this.state.seconds)}
            </span>
            <span className="clock__unit">seconds</span>
          </div>
        </div>
      </div>
    );
  }
}

export default class SectionBasics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deadline: "2019-12-8",
      error: undefined,
      newDeadline: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ newDeadline: e.target.value.trim() });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (isNaN(Date.parse(this.state.newDeadline))) {
      this.setState({
        error: "That doesn't seem to be a valid date"
      });
    } else if (Date.parse(this.state.newDeadline) < new Date()) {
      this.setState({ error: "Event has occured" });
    } else {
      this.setState({
        deadline: this.state.newDeadline,
        newDeadline: undefined,
        error: undefined
      });
    }

    this.inputRef.value = "";
  }
  formatDate() {
    return new Date(Date.parse(this.state.deadline)).toDateString();
  }
  render() {
    return (
      <div className="clock_2">
        <div className="app">
          <h1 className="app__title">Youth Sunday {this.formatDate()}</h1>
          <Clock deadline={this.state.deadline} />
          <form className="form" onSubmit={this.handleSubmit}>
            <input
              className="form__field"
              type="text"
              placeholder="Set new deadline"
              onChange={this.handleChange}
              ref={node => {
                this.inputRef = node;
              }}
            />
            <button className="btn" type="submit">
              Set Date
            </button>
          </form>
          {this.state.error && (
            <div className="message message--error">{this.state.error}</div>
          )}
        </div>
      </div>
    );
  }
}
