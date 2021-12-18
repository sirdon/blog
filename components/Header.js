import React, { useState } from "react";
import { APP_NAME } from "../config";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavbarText,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import Link from "next/link";
import Router from "next/router";
import { signout, isAuth } from "../actions/auth";
import NProgress from "nprogress";
NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Navbar color="light" expand="md" light>
        <Link href="/">
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar style={{ justifyContent: "right" }}>
          <Nav className="me-auto" navbar>
            {isAuth() ? (
              <>
                <NavItem style={{ paddingRight: "20px" }}>
                  <Button
                    color="primary"
                    outline
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      isAuth().role == 1
                        ? Router.replace("/admin")
                        : Router.replace("/user")
                    }
                  >
                    {`${isAuth().name}'s Dasdboard`}
                  </Button>
                </NavItem>
                <NavItem>
                  <Button
                    color="primary"
                    outline
                    style={{ cursor: "pointer" }}
                    onClick={() => signout(() => Router.replace("/signin"))}
                  >
                    Signout
                  </Button>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem style={{ paddingRight: "20px" }}>
                  <Link href="/signin">
                    <Button color="primary" outline>
                      Signin
                    </Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <Button color="primary" outline>
                      Signup
                    </Button>
                  </Link>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
