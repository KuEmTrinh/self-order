import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import "./Table.css";
export default function TableQRCode(props) {
  const table = JSON.parse(props.table);
  const tableCode = table.code;
  const tableId = table.id;
  const [qrLink, setQrLink] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    setQrLink("https://taporder.vercel.app/table/" + tableId + "/" + tableCode);
  }, []);
  const RenderComponent = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <div className="printContent">
          <div className="qrCode">
            <QRCode value={props.qrLink} ref={componentRef} />
          </div>
          <p className="qrcodePrintTitle textCenter mt-1">{props.tableName}</p>
          <p className="textDescription">Quét mã để gọi món</p>
        </div>
      </div>
    );
  });
  return (
    <div>
      <RenderComponent
        tableName={table.name}
        qrLink={qrLink}
        ref={componentRef}
      />
      <div className="printButton">
        <button className="button button-green " onClick={handlePrint}>
          In Mã Qr
        </button>
      </div>
    </div>
  );
}
