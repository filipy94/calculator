const buttons = {
    clear: {
        keyCode: 8,
        keyTrigger: 'AC',
        id: 'clear'
    },
    equal: {
        keyCode: 13,
        keyTrigger: '=',
        id: 'equals'
    },
    numbers: [
        {
            keyCode: 103,
            keyTrigger: '7',
            id: 'seven'
        },
        {
            keyCode: 104,
            keyTrigger: '8',
            id: 'eight'
        },
        {
            keyCode: 105,
            keyTrigger: '9',
            id: 'nine'
        },
        {
            keyCode: 100,
            keyTrigger: '4',
            id: 'four'
        },
        {
            keyCode: 101,
            keyTrigger: '5',
            id: 'five'
        },
        {
            keyCode: 102,
            keyTrigger: '6',
            id: 'six'
        },
        {
            keyCode: 97,
            keyTrigger: '1',
            id: 'one'
        },
        {
            keyCode: 98,
            keyTrigger: '2',
            id: 'two'
        },
        {
            keyCode: 99,
            keyTrigger: '3',
            id: 'three'
        },
        {
            keyCode: 96,
            keyTrigger: '0',
            id: 'zero'
        },
        {
            keyCode: 194,
            keyTrigger: '.',
            id: 'decimal'
        }
    ],
    operators: [
        [{
            keyCode: 111,
            keyTrigger: '/',
            id: 'divide'
        },
        {
            keyCode: 106,
            keyTrigger: '*',
            id: 'multiply'
        }],
        [{
            keyCode: 109,
            keyTrigger: '-',
            id: 'subtract'
        },
        {
            keyCode: 107,
            keyTrigger: '+',
            id: 'add'
        }]
    ]
}
const pressed = {color: 'white', border: '1px solid white'};
const notPressed = {color: 'black'};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button: buttons,
            log: '',
            display: '0',
            asw: ''
        };
        this.handleDisplay = this.handleDisplay.bind(this);
        this.erase = this.erase.bind(this);
        this.decimal = this.decimal.bind(this);
        this.numeral = this.numeral.bind(this);
        this.operator = this.operator.bind(this);
        this.calc = this.calc.bind(this)
    };
    handleDisplay(disp) {
        switch (disp) {
            case 'AC':
                this.erase();
                break;
            case '.':
                this.decimal();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.numeral(disp);
                break;
            case '/':
            case '*':
            case '-':
            case '+':
                this.operator(disp);
                break;
            case '=':
                this.calc();
                break;
        };
    };
    erase() {
        this.setState({
            log: '',
            display: '0'
        })
    };
    decimal() {
        if (!/\./.test(this.state.display)) {
            if (this.state.display === '0' || this.state.display.match(/[-/*+]$/) !== null) {
                this.setState({
                    log: this.state.log + '0.',
                    display: '0.'
                });
            } 
            else {
                this.setState({
                    log: this.state.log + '.',
                    display: this.state.display + '.'
                });
            };
        };
    };
    numeral(disp) {
        if (this.state.display === '0' || this.state.display.match(/[-/*+]$/) !== null) {
            this.setState({
                log: this.state.log + disp,
                display: disp
            });
        } 
        else {
            this.setState({
                log: this.state.log + disp,
                display: this.state.display + disp
            });
        };
    };
    operator(disp) {
        if (this.state.log.match(/=/) !== null) {
            this.setState ({
                log: this.state.asw + disp,
                display: disp,
                asw: ''
            })
        }
        else if (this.state.log.match(/[^-/*+]$/) !== null) {
            this.setState({
                log: this.state.log + disp,
                display: disp
            });
        }
        else if (this.state.log.match(/[^-/*+][-/*+]$/) !== null) {
            if (disp === '-') {
                this.setState({
                    log: this.state.log + disp,
                    display: disp
                });
            }
            else {
                this.setState({
                    log: this.state.log.slice(0, -1) + disp,
                    display: disp
                }); 
            };
        }
        else if (this.state.log.match(/[-/*+][-/*+]$/) !== null) {
            this.setState({
                log: this.state.log.slice(0, -2) + disp,
                display: disp
            });
        };
    };
    calc() {
        if (this.state.log.match(/^[-/*+]/) !== null) {
            this.setState({log: '0' + this.state.log})
        };
        let numArr = this.state.log.split(/[-/*+]/).map(n => {return n = Number(n)});
        let operatorArr = this.state.log.split(/[^-/*+]/).filter(e => {return e !== ''});
        var answer = 0;
        while (operatorArr.length > 0) {
            if (operatorArr.indexOf('*') !== -1) {
                let idx = operatorArr.indexOf('*');
                answer = numArr[idx] * numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('*-') !== -1) {
                let idx = operatorArr.indexOf('*-');
                numArr.splice(idx+1, 1);
                answer = numArr[idx] * -numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('/') !== -1) {
                let idx = operatorArr.indexOf('/');
                answer = numArr[idx] / numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('/-') !== -1) {
                let idx = operatorArr.indexOf('/-');
                numArr.splice(idx+1, 1);
                answer = numArr[idx] / -numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('-') !== -1) {
                let idx = operatorArr.indexOf('-');
                answer = numArr[idx] - numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('--') !== -1) {
                let idx = operatorArr.indexOf('--');
                numArr.splice(idx+1, 1);
                answer = numArr[idx] - -numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('+') !== -1) {
                let idx = operatorArr.indexOf('+');
                answer = numArr[idx] + numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
            else if (operatorArr.indexOf('+-') !== -1) {
                let idx = operatorArr.indexOf('+-');
                numArr.splice(idx+1, 1);
                answer = numArr[idx] + -numArr[idx+1];
                operatorArr.splice(idx, 1);
                numArr.splice(idx, 1, answer);
                numArr.splice(idx+1, 1);
            }
        };
        this.setState({
            log: this.state.log + '=' + answer,
            display: answer,
            asw: answer
        })
    };

    render() {
        return (
            <div id="wrapper">
                <div id='calculator'>
                    <div id='log'>{this.state.log}</div>
                    <div id='display'>{this.state.display}</div>
                    <div id='calculator-btns'>
                        <CalcButton atr={this.state.button.clear} handleDisplay={this.handleDisplay} /> 
                        <div id='operator1'>
                            {this.state.button.operators[0].map(e => {
                                return <CalcButton atr={e} handleDisplay={this.handleDisplay} />
                            })}
                        </div>
                        <div id='number-grid'>
                            {this.state.button.numbers.map(e => {
                                return <CalcButton atr={e} handleDisplay={this.handleDisplay} />
                            })}
                        </div>
                        <div id='operator2'>
                            {this.state.button.operators[1].map(e => {
                                return <CalcButton atr={e} handleDisplay={this.handleDisplay} />
                            })}
                        </div>
                        <CalcButton atr={this.state.button.equal} handleDisplay={this.handleDisplay} />                      
                    </div>
                </div>
                <p>Designed and Coded By</p>
                <a href="https://github.com/filipy94" target="_blank" title="My Github Page">Filipy Dellagnolo</a>
            </div>
        );
    };
};
class CalcButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyPressed: notPressed
          };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pressedPad = this.pressedPad.bind(this);
    };
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    };
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    };
    pressedPad() {
        if (this.state.keyPressed.color === 'black') {
          this.setState({keyPressed: pressed});
        } else {
          this.setState({keyPressed: notPressed});
        };
    };
    handleKeyPress(event) {
        if (event.keyCode === this.props.atr.keyCode) {
            this.pressedPad();
            setTimeout(() => this.pressedPad(), 150);
            this.props.handleDisplay(this.props.atr.keyTrigger);
        };
    };
    handleClick() {
        this.pressedPad();
        setTimeout(() => this.pressedPad(), 150);
        this.props.handleDisplay(this.props.atr.keyTrigger);
    };
    
    render() {
        return (
            <div style={this.state.keyPressed} onClick={this.handleClick} className='calc-btn' id={this.props.atr.id}>
                <h2>{this.props.atr.keyTrigger}</h2>
            </div>
        );
    };
};

ReactDOM.render(<App />, document.getElementById("app"))