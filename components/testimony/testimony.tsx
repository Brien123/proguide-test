"use client";

import React, { useState, SyntheticEvent } from "react";
import Carousel from "react-bootstrap/Carousel";
import Pro from "../images/pro+logo.png";
import MyImage from "../images/imageDiv";
import { CentralisedBody, Testimonials } from "../utilityComponents";
import Styles from "./testimony.module.css";

/* 
 In future updates, the testimonies should be fetched from db
 */

const Testimony = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (
    selectedIndex: number,
    e: Record<string, unknown> | null
  ) => {
    setIndex(selectedIndex);
  };
  return (
    <div className={`${Styles.extremebg}`} style={{minHeight:'300px'}} id="testimonies">
      <center>
        <div className={` text-center fs-2 bottomBold arima m-2 orangedefault`}>
          What Do Our Clients Say?
        </div>
      </center>

      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        variant="dark"
        
      >
        <Carousel.Item className="h-80">
          <CentralisedBody addClasses="container-fluid  h-100">
            <Testimonials
              name="P. Dominick, l400 Computer Science"
              testimony="It was crazy to think that all I had to do was lick a link and I would et my Transcript handed to me but guys it works!"
            />
          </CentralisedBody>
        </Carousel.Item>
        <Carousel.Item>
          <CentralisedBody addClasses="container-fluid  h-100">
            <Testimonials
              name="Thelvis Bright, USc GBHS Mambanda"
              testimony="I've got a personal Assistant in my pocket, This is sensational"
            />
          </CentralisedBody>
        </Carousel.Item>

        <Carousel.Item>
          <CentralisedBody addClasses="container-fluid  h-100">
            <Testimonials
              name="Mbeng Juvis,High School Teacher"
              testimony=" Delegating tasks and assignments to my students has never been so easy"
            />
          </CentralisedBody>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Testimony;
