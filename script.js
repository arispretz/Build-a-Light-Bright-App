const Header = (props) => {
  const { undo, reset, notify } = props;
  return (
    <header id="header" className="row">
      <div className="col-">
        <h1>“Light-Bright App”</h1>
        <h6>Created by Ariana Spretz - Copyright 2024</h6>
      </div>
      <div className="col- mx-5">
        <button id="undo"  className="btn fas fa-undo" onClick={undo}  title="Undo" />
        <button id="reset" className="btn fas fa-trash-alt" onClick={reset} title="Reset" />
      </div>
      {notify ? (
        <div className="col- text-center">
          <span id="err-mssg" className={notify ? 'show' : 'hide'}>Nothing to undo</span>
        </div>
      ) : (
        <span />
      )}
      
    </header>
    
  );
 
};

const Panel = (props) => {
  const { num, doubleClick, mouseDown, mouse_down, mouseEnter } = props;
  return (
    <div id="panel">
      {[...Array(num)].map((_, i) =>
        <div 
          key={i} 
          id={i} 
          className="circle" 
          onDoubleClick={doubleClick}
          onMouseDown={mouseDown}
          onMouseEnter={mouse_down ? mouseEnter : undefined}
        />
      )}
   </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circles: 684, //504
      rng: () => randomColor(),
      color: randomColor(),
      temp: [],
      history: [],
      mouseUp: true,
      mouseDown: false,
      showMessage: false,
    };
    this.handleUndo = this.handleUndo.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleHistory = this.handleHistory.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }
    
  handleUndo(e) {
    let history = this.state.history;
    let empty = history.length === 0;
    
    if (empty) {
      this.setState({ showMessage: true });
      return;
    }
    
    let prev = history.pop();
    
    if (Array.isArray(prev)) {
      for (let circle of prev) {
        circle.style.background = '#1C1D21';
        circle.style.boxShadow = 'none';
      }
    } else {
      prev.style.background = '#1C1D21';
      prev.style.boxShadow = 'none';
    }
    
    this.setState({ history });
  }
  
  handleReset() {
    const collection = document.getElementsByClassName("circle");
    for (let circle of collection) {
      circle.style.background = '#1C1D21';
      circle.style.boxShadow = 'none';
    }
  }
  
  handleColor(e) {
    e.target.style.background = this.state.color;
    e.target.style.boxShadow = `0 0 5px 1px ${this.state.color}`;
  }
  
  handleMouseUp(e) {    
    this.handleHistory(this.state.temp);
    
    this.setState({
      mouseUp: !this.state.mouseUp, 
      mouseDown: !this.state.mouseDown,
      color: this.state.rng(),
      temp: [],
    });
  }
  
  handleHistory(arr) {
    let history = this.state.history;
    
    if (arr.length > 1) {
      history.push(arr);
    } else {
      history.push(arr.pop());
    }
    
    this.setState({ history });
  }
  
  handleMouseDown(e) {
    e.preventDefault();
        
    let temp = [];
    temp.push(e.target);
    
    this.setState({
      mouseDown: !this.state.mouseDown, 
      mouseUp: !this.state.mouseUp,
      showMessage: this.state.showMessage ? false : false,
      temp: temp
    });
    
    this.handleColor(e);
  }
  
  handleMouseEnter(e) {
    this.setState({
      temp: [...this.state.temp, e.target]
    });
    
    this.handleColor(e);
  }
  
  handleDoubleClick(e) {
    e.target.style.background = '#1C1D21';
    e.target.style.boxShadow = 'none';
  }
  
  render () {
    const { mouseUp, mouseDown, showMessage, circles, demo } = this.state;
    return (
      <main onMouseUp={mouseDown ? this.handleMouseUp : undefined}>
        <Header 
          undo={this.handleUndo} 
          reset={this.handleReset} 
          notify={showMessage} 
        />
        <div id="panelParent">
          <Panel
            num={circles}
            doubleClick={this.handleDoubleClick} 
            mouseDown={this.handleMouseDown}
            mouse_down={mouseDown}
            mouseEnter={this.handleMouseEnter}
          
          />
        </div>
      </main>
    );
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));
