import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://192.168.1.13:5000/api";

export default function VerifyCertificate() {

    const { serialNumber } = useParams();

    const [certificate, setCertificate] = useState<any>(null);

    useEffect(() => {

        fetch(`${API}/certificates/verify/${serialNumber}`)
            .then(res => res.json())
            .then(data => {
                setCertificate(data);
            });

    }, [serialNumber]);

    if (!certificate) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: 30 }}>

            <h1>Certificate Verification</h1>

            <hr />

            <p>
                <strong>Serial Number :</strong>{" "}
                {certificate.serialNumber}
            </p>

            <p>
                <strong>Student Name :</strong>{" "}
                {certificate.studentName}
            </p>

            <p>
                <strong>College :</strong>{" "}
                {certificate.collegeName}
            </p>

            <p>
                <strong>Project :</strong>{" "}
                {certificate.projectTitle}
            </p>

            <p>
                <strong>Certificate :</strong>{" "}
                {certificate.certificateTitle}
            </p>

            <p>
                <strong>From :</strong>{" "}
                {certificate.fromDate}
            </p>

            <p>
                <strong>To :</strong>{" "}
                {certificate.toDate}
            </p>

        </div>
    );
}