import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import contactImg from "../assets/img/contact.png";
import "../styles/contact.css";

function Contact() {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState("Send");
  const [status, setStatus] = useState({});
  const isFormIncomplete = Object.values(formDetails).some((value) => value === '');

  

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let buttonTextCycle = ["Sending", "Sending.", "Sending..", "Sending..."];
    let cycleIndex = 0;
  
    // Start the sending text cycle
    const cycleButtonText = () => {
      setButtonText(buttonTextCycle[cycleIndex]);
      cycleIndex = (cycleIndex + 1) % buttonTextCycle.length;
    };
  
    const buttonTextInterval = setInterval(cycleButtonText, 100);
    setButtonText("Sending...");
  
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, "Contact"), formDetails);
  
      clearInterval(buttonTextInterval); // Stop the sending text cycle
      setButtonText("Send");
      setFormDetails(formInitialDetails);
      setStatus({ success: true, message: "Message sent successfully." });
    } catch (error) {
      console.error("Error adding document: ", error);
      clearInterval(buttonTextInterval); // Stop the sending text cycle
      setButtonText("Send");
      setStatus({
        success: false,
        message: "Something went wrong, please try again later.",
      });
    }
  };
  

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={`${
                    isVisible ? "" : ""
                  } d-none d-md-block`}
                  src={contactImg}
                  alt="Contact Us"
                />
              )}
            </TrackVisibility>
          </Col>

          <Col size={12} md={6}>
            <div>
              <h2>Get In Touch</h2>
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col size={12} sm={6} className="px-1">
                    <input
                      type="text"
                      value={formDetails.firstName}
                      placeholder="First Name"
                      onChange={(e) =>
                        onFormUpdate("firstName", e.target.value)
                      }
                    />
                  </Col>
                  <Col size={12} sm={6} className="px-1">
                    <input
                      type="text"
                      value={formDetails.lastName}
                      placeholder="Last Name"
                      onChange={(e) => onFormUpdate("lastName", e.target.value)}
                    />
                  </Col>
                  <Col size={12} sm={6} className="px-1">
                    <input
                      type="email"
                      value={formDetails.email}
                      placeholder="Email Address"
                      onChange={(e) => onFormUpdate("email", e.target.value)}
                    />
                  </Col>
                  <Col size={12} sm={6} className="px-1">
                    <input
                      type="tel"
                      value={formDetails.phone}
                      placeholder="Phone No."
                      onChange={(e) => onFormUpdate("phone", e.target.value)}
                    />
                  </Col>
                  <Col size={12} className="px-1">
                    <textarea
                      rows="6"
                      value={formDetails.message}
                      
                      placeholder="Message"
                    onChange={(e) => onFormUpdate("message", e.target.value)}
                    ></textarea>
                  <button type="submit" disabled={isFormIncomplete}>
                      <span>{buttonText}</span>
                    </button>
                  </Col>
                </Row>
                {status.message && (
                  <Col>
                    <p
                      className={
                        status.success === false
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {status.message}
                    </p>
                  </Col>
                )}
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contact;
