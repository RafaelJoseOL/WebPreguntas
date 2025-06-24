import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-primary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Inicio
        </Link>
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
            {/* <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/asignatura1"
              >
                Asignatura 1
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/asignatura2">
                Asignatura 2
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/addPregunta">
                Añadir preguntas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
