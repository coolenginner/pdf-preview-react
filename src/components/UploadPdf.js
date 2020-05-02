import React, { useState, useEffect } from "react";
import { Form } from "semantic-ui-react";
import { Draggable, Droppable } from "react-drag-and-drop";
import { Rnd } from "react-rnd";
import { Document, Page } from "react-pdf";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [addfile, setaddFile] = useState(null);
  const [dragitem, setDragitem] = React.useState([]);
  const [Pagelist, setPagelist] = React.useState([]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setaddFile(event.target.files[0]);
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

  const onDrop = React.useCallback((result, e) => {
    var target = e.target || e.srcElement;
    var rect = target.getBoundingClientRect();
    let newArray = [...dragitem];
    let newObject = {
      dragitems: result.dragitems,
      position: { x: e.pageX - rect.left, y: e.pageY - 90 },
    };
    newArray.push(newObject);
    setDragitem(newArray);
  });

  return (
    <>
      <div>
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

        <div className="main container">
          <Droppable types={["dragitems"]} onDrop={onDrop}>
            <div className="add-background">
              <div className="row">
                <div className="col-md-4">
                  <div class="upload-btn-wrapper">
                    <Link
                      to={{
                        pathname: "/",
                      }}
                    >
                      <button class="btn btn-primary btn-lg mx-auto">
                        Home
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <Form>
                    <div class="upload-btn-wrapper">
                      <button class="btn">Upload PDF</button>
                      <input
                        type="file"
                        name="myfile"
                        onChange={onFileChange}
                      />
                    </div>
                  </Form>
                </div>

                <div className="col-md-4">
                  <Form>
                    <div class="upload-btn-wrapper">
                      {addfile && (
                        <Link
                          to={{
                            pathname: "/Sign",

                            file: addfile,
                            dragitems: dragitem,
                          }}
                        >
                          <button class="btn btn-primary btn-lg mx-auto">
                            Sign Pdf
                          </button>
                        </Link>
                      )}
                    </div>
                  </Form>
                </div>
              </div>

              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                noData={
                  <h4 className="success-file">
                    <p> Please select a file</p>
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
                      default={{
                        x: item.position.x,
                        y: item.position.y,
                      }}
                    >
                      <div>
                        {item.dragitems == "Signature" ? (
                          <div className="items">{item.dragitems}</div>
                        ) : null}
                      </div>

                      <div>
                        {item.dragitems == "Intital" ? (
                          <div className="items">{item.dragitems}</div>
                        ) : null}
                      </div>

                      <div>
                        {item.dragitems == "Date" ? (
                          <div className="items">{item.dragitems}</div>
                        ) : null}
                      </div>
                    </Rnd>
                  </>
                );
              })}
            </div>
          </Droppable>
        </div>
      </div>
    </>
  );
}

export default Upload;
