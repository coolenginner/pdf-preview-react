import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Container, Header, Grid, Form, Popup, Item } from "semantic-ui-react";
import { Document, Page } from "react-pdf";
import "../src/assets/styles.css";
import { Draggable, Droppable } from "react-drag-and-drop";
import { Rnd } from "react-rnd";
import * as jsPDF from "jspdf";
import * as html2canvas from "html2canvas";
import styles from "./assets/styles.css";
import $ from "jquery";
import SignaturePad from "react-signature-canvas";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App(props) {
  const [file, setFile] = useState(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [usertext, setUsername] = useState();
  const [date, setDate] = useState();
  const [showtext, toggleShowtext] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDate, setShowDate] = useState(true);
  const [dragitem, setDragitem] = React.useState([]);
  const [Pagelist, setPagelist] = React.useState([]);
  const [continuebutton, setContinuebutton] = useState(false);

  const toggleContinue = () => {
    setContinuebutton(!continuebutton);
  };

  useEffect(() => {
    useDate();
  });

  const useDate = () => {
    let current_datetime = new Date();
    let date =
      current_datetime.getDate() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getFullYear();
    setDate(date);
  };

  const myChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const toggleText = (e) => {
    toggleShowtext(!showtext);
  };

  var sigPad = {};

  const clear = () => {
    sigPad.clear();
  };

  const trim = () => {
    setTrimmedDataURL(sigPad.getTrimmedCanvas().toDataURL("image/png"));
    setShowPopup(!showPopup);
  };

  const togglePopup = () => {
    if (trimmedDataURL === null) {
      setShowPopup(!showPopup);
    }
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onDocumentLoadSuccess = (numPages, i) => {
    var j = numPages.numPages;
    var item = "";
    for (i = 0; i < j; i++) {
      item += i + " ";
    }
    var n = item;
    let numStringArr = `${n}`.split("").map((el) => parseInt(el));
    var numStringArrs = numStringArr.filter((e) => e === 0 || e);
    setPagelist(numStringArrs);
  };

  const handlePdf = () => {
    var HTML_Width = $(".react-pdf__Document").width();
    var HTML_Height = $(".react-pdf__Document").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width;
    var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(".canvas_div_pdf")[0], {
      logging: true,
      allowTaint: false,
      scale: 1,
      scrollX: 0,
      scrollY: 0,
    }).then(function (canvas) {
      canvas.getContext("2d");

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Height, PDF_Width]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("Doc.pdf");
      $(".canvas_div_pdf").hide();
    });
  };

  const onDrop = React.useCallback((result, e) => {
    var target = e.target || e.srcElement;
    var rect = target.getBoundingClientRect();
    let newArray = [...dragitem];
    let newObject = {
      dragitems: result.dragitems,
      position: { x: e.pageX - rect.left, y: e.pageY - 86 },
    };
    newArray.push(newObject);
    setDragitem(newArray);
  });

  function handleDrag(ui, index) {
    let item = dragitem;
  }

  const handleMouseDown = (e) => {};

  return (
    <div>
      <div>
        {!continuebutton && (
          <div className="sidenav">
            <Draggable type="dragitems" data="Signature">
              <a>Signature</a>
            </Draggable>
            <Draggable type="dragitems" data="Intital">
              <a>Initial</a>
            </Draggable>
            <Draggable type="dragitems" data="Date">
              <a>Date</a>
            </Draggable>
          </div>
        )}

        {continuebutton && (
          <div className="sidenav">
            <p className="text-sidebar">Pdf Preview</p>

            {showPopup && (
              <div className="Apps">
                <div>
                  <div>
                    <SignaturePad
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "sigCanvas",
                      }}
                      ref={(ref) => {
                        sigPad = ref;
                      }}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary btn-lg mx-auto"
                      onClick={clear}
                    >
                      Clear{" "}
                    </button>
                    <button
                      className="btn btn-primary btn-lg mx-auto"
                      onClick={trim}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showtext && (
              <div className="Apps">
                <form>
                  <input
                    type="text"
                    maxlength="3"
                    placeholder="Mr/Mrs"
                    onChange={(e) => myChangeHandler(e)}
                  />
                  <br></br>
                  <br></br>

                  <button
                    className="btn btn-primary btn-lg mx-auto"
                    type="submit"
                    onClick={() => toggleText()}
                  >
                    Close{" "}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="main container">
          <Droppable types={["dragitems"]} onDrop={onDrop}>
            <div className="add-background">
              <div className="row">
                <div className="col-md-6">
                  {continuebutton && (
                    <button
                      onClick={handlePdf}
                      className="btn btn-primary btn-lg mx-auto"
                    >
                      Generate PDF
                    </button>
                  )}
                </div>

                <div className="col-md-6 rightbutton">
                  {!continuebutton && (
                    <button
                      onClick={toggleContinue}
                      className="btn btn-primary btn-lg mx-auto"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>

              {/* all-popup */}

              {!continuebutton && (
                <Form>
                  <div className="upload-btn">
                    <input
                      type="file"
                      onChange={onFileChange}
                      className="button-select"
                    ></input>
                  </div>
                </Form>
              )}

              {continuebutton && <div className="items-pdf"></div>}

              <div className="container">
                <div className="canvas_div_pdf" id="page">
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    noData={
                      <h4 className="success-file">
                        {!continuebutton && <p> Please select a file</p>}
                      </h4>
                    }
                  >
                    {Pagelist.map((page) => (
                      <Page pageNumber={page} />
                    ))}
                  </Document>

                  {dragitem.map((item) => {
                    return (
                      <>
                        <Rnd
                          onDragStop={(e, ui) => handleDrag(ui)}
                          onMouseDown={handleMouseDown}
                          default={{
                            x: item.position.x,
                            y: item.position.y,
                          }}
                        >
                          {/* signature */}

                          {!continuebutton && (
                            <div>
                              {item.dragitems == "Signature" ? (
                                <div className="items">{item.dragitems}</div>
                              ) : null}
                            </div>
                          )}

                          {continuebutton && (
                            <div>
                              {item.dragitems == "Signature" ? (
                                <div onClick={() => togglePopup()}>
                                  <div>
                                    {trimmedDataURL ? (
                                      <img
                                        className={styles.sigImage}
                                        src={trimmedDataURL}
                                      />
                                    ) : (
                                      <div className="items">
                                        {item.dragitems}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}

                          {!continuebutton && (
                            <div>
                              {item.dragitems == "Intital" ? (
                                <div className="items">{item.dragitems}</div>
                              ) : null}
                            </div>
                          )}

                          {continuebutton && (
                            <div>
                              {item.dragitems == "Intital" && (
                                <div onClick={() => toggleText()}>
                                  <div>
                                    <div className="items">
                                      {usertext ? usertext : item.dragitems}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {!continuebutton && (
                            <div>
                              {item.dragitems == "Date" ? (
                                <div className="items">{item.dragitems}</div>
                              ) : null}
                            </div>
                          )}

                          {continuebutton && (
                            <div>
                              {item.dragitems == "Date" && (
                                <div>
                                  <div>
                                    {showDate && (
                                      <div className="items">{date}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Rnd>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </Droppable>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
