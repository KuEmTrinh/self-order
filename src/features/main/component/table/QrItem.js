import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import "./Table.css";
export default function QrItem(props) {
  const table = JSON.parse(props.table);
  const tableCode = table.code;
  const tableId = table.id;
  const [qrLink, setQrLink] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    setQrLink("https://taporder.vercel.app/table/" + tableId + "/" + tableCode);
  }, []);
  const RenderComponent = React.forwardRef((props, ref) => {
    return (
      <div className="qrCodeContent" ref={ref}>
        {showQrCode ? (
          <div className="qrCode">
            <QRCode size={152} value={props.qrLink} ref={componentRef} />
          </div>
        ) : (
          <div className="qrCodeFade"><p>QrCode</p></div>
        )}
        <p className="qrcodePrintTitle textCenter mt-1">{props.tableName}</p>
      </div>
    );
  });
  return (
    <div className="qrCodeItemView">
      {RenderComponent ? (
        <RenderComponent
          tableName={table.name}
          qrLink={qrLink}
          ref={componentRef}
        />
      ) : (
        "Loading"
      )}
      <div className="printButton">
        <button
          className="button button-green "
          onClick={() => {
            setShowQrCode(true);
            setTimeout(() => {
              handlePrint();
            }, 100);
            setTimeout(() => {
              setShowQrCode(false);
            }, 200);
          }}
        >
          In
        </button>
      </div>
    </div>
  );
}
