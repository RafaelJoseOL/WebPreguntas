function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-primary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Inicio
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Asignatura 1
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Asignatura 2
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Asignatura 3
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
