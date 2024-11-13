import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QrTest = () => {
  const [data, setData] = useState("No result");
  const [startScan, setStartScan] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setStartScan(!startScan);
        }}
      >
        {startScan ? "Stop Scan" : "Start Scan"}
      </button>
      <div
        style={{
          width: "500px",
        }}
      >
        {startScan && (
          <>
            <QrReader
              constraints={{
                facingMode: "environment",
              }}
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                  console.log(JSON.stringify(result));
                  setStartScan(!startScan);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default QrTest;