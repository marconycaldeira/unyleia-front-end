import React from "react"
import { Link } from "gatsby"

import { Navbar, Nav } from "react-bootstrap"

const CustomNavbar = ({ pageInfo }) => {

  return (
    <>
      <Navbar variant="dark" expand="lg" id="site-navbar">
        {/* <Container> */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" activeKey={pageInfo && pageInfo.pageName}>
            <Link to="/" className="link-no-style">
              <Nav.Link as="span" eventKey="index">
                Livros
              </Nav.Link>
            </Link>
            <Link to="/authors" className="link-no-style">
              <Nav.Link as="span" eventKey="authors">
                Autores
              </Nav.Link>
            </Link>
            <Link to="/publishers" className="link-no-style">
              <Nav.Link as="span" eventKey="publishers">
              Editoras
              </Nav.Link>
            </Link>
            <Link to="/genrers" className="link-no-style">
              <Nav.Link as="span" eventKey="genrers">
              Gêneros Literários
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
    </>
  )
}

export default CustomNavbar
