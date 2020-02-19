var BulNav = React.createClass({
  render: function() {
    return (

      <nav className="navbar is-fixed-top is-transparent">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://urbantomato.netlify.com/">
            <h1 className="title">UT</h1>
          </a>
          <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item" href="https://www.kraefted.com/">
              Kftd
            </a>
            <div className="navbar-item has-dropdown is-hoverable is-right">
              <a className="navbar-link" href>
                Projects
              </a>
              <div className="navbar-dropdown is-boxed">
                <a className="navbar-item" href="https://rocknrollbing-v1.netlify.com/">
                  Rock'n'Roll Bingo
                </a>
                <a className="navbar-item" href>
                  Calc
                </a>
                <a className="navbar-item" href>
                  Form
                </a>
                <hr className="navbar-divider" />
                <a className="navbar-item" href>
                  Elements
                </a>
                <a className="navbar-item is-active" href>
                  Components
                </a>
              </div>
            </div>
          </div>
        </div></nav>
      {/* Nav */}
    );
  }
});

const domContainer = document.querySelector('#bulnav');
ReactDOM.render(e(BulNav), domContainer);
