import React from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { CentralisedBody } from "../utilityComponents";

const ContactForm = () => {
  return (
    <section id="contact">
      <CentralisedBody addClasses="p-4">
        <div className="w-80 h-80 rounded shadow-lg row">
          <div className="col-md-8">
            <Form className="p-3">
              <span className="arima fs-4">Get In Touch</span>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Email" />
                    
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Name" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="subject">
                <Form.Control type="text" placeholder="Subject" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="message">
                <textarea
                  className="w-100 form-control"
                  placeholder="Message"
                  cols={10}
                ></textarea>
              </Form.Group>

              <Button className="backgroundOrangeColor" type="submit">
                Send Message
              </Button>
            </Form>
          </div>
          <div className="col-md-4 backgroundBlueColor rounded-right nunito p-3" style={{color:'white'}}>
            <span className="fs-4">Contact Us</span>
            <div className="d-flex flex-column">
                <div className=" p-3">
                    <i className=" fa fa-map-marker "></i> &nbsp;
                    Bonaberi - Douala, Cameroon
                </div>
                <div className=" p-3">
                <i className=" fa fa-phone "></i> &nbsp;
                    (+237) 682898606
                </div>
                <div className=" p-3">
                <i className=" fa fa-envelope "></i> &nbsp;
                    contactus@proguide.com
                </div>
                <div className=" p-3">
                <i className=" fa fa-globe "></i> &nbsp;
                    www.studentproguide.site
                </div>
            </div>

          </div>
        </div>
      </CentralisedBody>
    </section>
  );
};

export default ContactForm;
