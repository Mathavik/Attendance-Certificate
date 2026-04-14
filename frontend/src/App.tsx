import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type CertificateFields = {
  studentName: string;
  collegeName: string;
  fromDate: string;
  toDate: string;
  date: string;
  certificateTitle: string;
  projectTitle: string;
  certificateContent: string;
  signatoryTitle: string;
  attendanceTotalDays: string;
  attendanceDaysAttended: string;
  attendancePercentage: string;
};

const defaultFields: CertificateFields = {
  studentName: "Ms SRIJANNADEVI V M",
  collegeName: "Rani Anna Government College for Women, Tirunelveli",
  fromDate: "12th December 2025",
  toDate: "30th March 2026",
  date: '30.03.2026',
  certificateTitle: 'ATTENDANCE CERTIFICATE',
  projectTitle: 'ENTERPRISE WORKFLOW AUTOMATION SYSTEM',

  // ✅ CHANGE HERE
  certificateContent:
      'This is to certify that {{student Name}} final year M.Sc Computer Science student of {{college Name}} has successfully attended the project work titled "{{project Title}}" at Pavitha Consultancy Services from {{from Date}} to {{to Date}}. During this period, the student was present and actively participated in all the scheduled sessions. The student has demonstrated consistent attendance and engagement throughout the period.\n\nWe wish every success in a successful future career.',
  

  signatoryTitle: 'For PAVITHA CONSULTANCY SERVICES PVT LTD',
  attendanceTotalDays: '84 (exclude Sundays and other government holidays)',
  attendanceDaysAttended: '73',
  attendancePercentage: '87%',
};

const defaultPages: CertificateFields[] = [
  defaultFields,
  {
    ...defaultFields,
    certificateTitle: 'PROJECT COMPLETION CERTIFICATE',
   certificateContent:
      `This is to certify that {{student Name}}, a student of {{college Name}} in M.Sc Computer Science, has successfully completed the project titled "{{project Title}}" under the guidance of PCS Software Solutions from {{from Date}} to {{to Date}}. The performance during this period was found to be satisfactory.

We wish the student all the best in all future endeavours.`
  }
];

const App: React.FC = () => {
  const [pagesData, setPagesData] = useState<CertificateFields[]>(defaultPages);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const parseContent = (content: string, page: CertificateFields) => {
    return content
      .replace(/{{student Name}}/g, `<strong>${page.studentName}</strong>`)
      .replace(/{{college Name}}/g, `<strong>${page.collegeName}</strong>`)
      .replace(/{{from Date}}/g, `<strong>${page.fromDate}</strong>`)
      .replace(/{{to Date}}/g, `<strong>${page.toDate}</strong>`)
      .replace(/{{project Title}}/g, `<strong>${page.projectTitle}</strong>`);
  };
  const setPageRef = (index: number) => (element: HTMLElement | null) => {
    pageRefs.current[index] = element;
  };

  const handleChange = (index: number, key: keyof CertificateFields, value: string) => {
    setPagesData((current) =>
      current.map((page, pageIndex) =>
        pageIndex === index ? { ...page, [key]: value } : page,
      ),
    );
  };

  const downloadPDF = async () => {
    const pages = pageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (pages.length === 0) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (index > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save('certificate.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Form Inputs */}

          <form className="space-y-6 rounded-lg border border-slate-300 bg-white p-6 shadow h-fit">
            {pagesData.map((page, index) => (
              <div key={index} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Certificate {index + 1} Inputs
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Student Name
                  </label>
                  <input
                    value={page.studentName}
                    onChange={(e) => handleChange(index, 'studentName', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Enter Student Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Date</label>
                  <input
                    value={page.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    College Name
                  </label>
                  <input
                    value={page.collegeName}
                    onChange={(e) => handleChange(index, 'collegeName', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    From Date
                  </label>
                  <input
                    value={page.fromDate}
                    onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    To Date
                  </label>
                  <input
                    value={page.toDate}
                    onChange={(e) => handleChange(index, 'toDate', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Certificate Title</label>
                  <input
                    value={page.certificateTitle}
                    onChange={(e) => handleChange(index, 'certificateTitle', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Certificate Title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Project Title</label>
                  <input
                    value={page.projectTitle}
                    onChange={(e) => handleChange(index, 'projectTitle', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Project Title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Certificate Content</label>
                  <textarea
                    value={page.certificateContent}
                    onChange={(e) => handleChange(index, 'certificateContent', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs h-28 resize-none"
                    placeholder="Certificate Content"
                  />
                </div>
                {page.certificateTitle === 'ATTENDANCE CERTIFICATE' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Total No. of Days Allotted</label>
                      <input
                        value={page.attendanceTotalDays}
                        onChange={(e) => handleChange(index, 'attendanceTotalDays', e.target.value)}
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        placeholder="Total No. of Days Allotted"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">No. of Days Attended</label>
                      <input
                        value={page.attendanceDaysAttended}
                        onChange={(e) => handleChange(index, 'attendanceDaysAttended', e.target.value)}
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        placeholder="No. of Days Attended"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Percentage of Attendance</label>
                      <input
                        value={page.attendancePercentage}
                        onChange={(e) => handleChange(index, 'attendancePercentage', e.target.value)}
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        placeholder="Percentage of Attendance"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Signatory Title</label>
                  <input
                    value={page.signatoryTitle}
                    onChange={(e) => handleChange(index, 'signatoryTitle', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Signatory Title"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={downloadPDF}
              className="w-full rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Download PDF
            </button>
          </form>


          {/* Certificate Preview */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
            {pagesData.map((page, index) => (
              <section
                key={index}
                ref={setPageRef(index)}
                className="border border-slate-200 shadow-lg overflow-hidden bg-white"
                style={{
                  width: '794px',
                  height: '1123px',
                  backgroundImage: "url('/images/bg.png')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  fontFamily: "'Times New Roman', serif",
                  padding: '160px 80px 80px 80px' // Top padding-ai increase panniruken header image-kaga
                }}
              >
                {/* Date - Now Relative to follow the header image flow */}
                <div className="text-right text-[14px] font-bold text-black mb-4">
                  {page.date}
                </div>

                {/* Title - Centered & Underlined */}
                <div className="mt-10 text-center mb-10">
                  <h2 className="text-[18px] font-bold border-b-2 border-black inline-block pb-1 uppercase">
                    {page.certificateTitle}
                  </h2>
                </div>

                {/* Main Content - Justified */}
                <div
                  className="text-[15px] leading-[1.8] text-justify text-black mb-6 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: parseContent(page.certificateContent, page),
                  }}
                />

                {/* Attendance Details Section */}
                {page.certificateTitle === 'ATTENDANCE CERTIFICATE' && (
                  <div className="mt-10 text-[15px] leading-[1.8] text-black">
                    <p className="mb-4 font-bold underline uppercase">
                      Attendance Details
                    </p>
                    <div className="space-y-2">
                      <p><span className="font-bold">Total No. of Days Allotted:</span> {page.attendanceTotalDays}</p>
                      <p><span className="font-bold">No. of Days Attended:</span> {page.attendanceDaysAttended}</p>
                      <p><span className="font-bold">Percentage of Attendance:</span> {page.attendancePercentage}</p>
                    </div>
                  </div>
                )}

                {/* Signature Section */}
                <div className="absolute right-16 bottom-70 text-right">
                  <div className="mb-4 h-12"></div>
                  <p className="text-[14px] font-bold uppercase">
                    {page.signatoryTitle}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

