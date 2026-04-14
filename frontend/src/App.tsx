import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type CertificateFields = {
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
  date: '30.03.2026',
  certificateTitle: 'ATTENDANCE CERTIFICATE',
  projectTitle: 'ENTERPRISE WORKFLOW AUTOMATION SYSTEM',
  certificateContent:
    'This is to certify that Ms SRIJANNADEVI V M final year M.Sc Computer Science student of Rani Anna Government College for Women, Tirunelveli, has successfully attended the project work titled "ENTERPRISE WORKFLOW AUTOMATION SYSTEM" at Pavitha Consultancy Services from 12th December 2025 to 30th March 2026. During this period, the student was present and actively participated in all the scheduled sessions. She has demonstrated consistent attendance and engagement throughout the period.\n\nWe wish every success in her future career.',
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
      'This is to certify that Ms SRIJANNADEVI V M, final year M.Sc Computer Science student of Rani Anna Government college for Women, Tirunelveli, has successfully completed the project titled "ENTERPRISE WORKFLOW AUTOMATION SYSTEM" under the guidance of PCS Software Solutions from 12th December 2025 to 30th March 2026. During this period, the student was present and actively participated in all the scheduled sessions. We wish her the best in her future endeavours.',
  },
];

const App: React.FC = () => {
  const [pagesData, setPagesData] = useState<CertificateFields[]>(defaultPages);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
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
                  <label className="block text-xs font-semibold text-slate-700">Date</label>
                  <input
                    value={page.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    placeholder="Date"
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
                className="border border-slate-200 shadow-lg overflow-hidden"
                style={{
                  width: '620px',
                  height: '880px',
                  backgroundImage: "url('/images/bg.png')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                }}
              >
                <div className="absolute right-12 top-[112px] text-right text-[11px] font-medium text-slate-900">
                  {page.date}
                </div>

                <div className="absolute left-0 right-0 top-[152px] text-center">
                  <h2 className="text-[14px] font-bold tracking-[0.3em] text-slate-900 border-b border-black inline-block pb-1 uppercase">
                    {page.certificateTitle}
                  </h2>
                </div>

                <div className="absolute left-0 right-0 top-[192px] text-center px-20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.55em] text-slate-700">
                    {page.projectTitle}
                  </p>
                </div>

                <div className="absolute left-24 right-24 top-[240px] bottom-[310px] overflow-y-auto text-left text-[11px] leading-[1.9] text-slate-900 whitespace-pre-wrap" style={{ textAlign: 'left' }}>
                  {page.certificateContent}
                </div>
                {page.certificateTitle === 'ATTENDANCE CERTIFICATE' && (
                  <div className="absolute left-24 right-24 top-[510px] text-left text-[11px] leading-[1.9] text-slate-900">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]">
                      Attendance Details
                    </p>
                    <p className="mb-1">Total No. of Days Allotted: {page.attendanceTotalDays}</p>
                    <p className="mb-1">No. of Days Attended: {page.attendanceDaysAttended}</p>
                    <p>Percentage of Attendance: {page.attendancePercentage}</p>
                  </div>
                )}

                <div className="absolute right-16 bottom-[110px] text-right text-[11px] font-semibold text-slate-900">
                  {page.signatoryTitle}
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

