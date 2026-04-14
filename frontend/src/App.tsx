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
  certificateContent:
      'This is to certify that {{student Name}} final year M.Sc Computer Science student of {{college Name}} has successfully attended the project work titled "{{project Title}}" at Pavitha Consultancy Services from {{from Date}} to {{to Date}}. During this period, the student was present and actively participated in all the scheduled sessions. The student has demonstrated consistent attendance and engagement throughout the period.\n\nWe wish every success in a successful future career.',
  

  signatoryTitle: 'For PAVITHA CONSULTANCY SERVICES PVT LTD',
  attendanceTotalDays: '84 (exclude Sundays and other government holidays)',
  attendanceDaysAttended: '73',
  attendancePercentage: '87%',
};

const defaultPages: CertificateFields[] = [
  { ...defaultFields },
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
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (index > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      pdf.save(`Certificates_${pagesData[0].studentName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          
          {/* Left Side: Input Form (Sticky to keep it visible while scrolling) */}
          <div className="h-fit lg:sticky lg:top-10">
            <form className="space-y-6 rounded-lg border border-slate-300 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-blue-900 border-b pb-2">Certificate Editor</h2>
              
              <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-8">
                {pagesData.map((page, index) => (
                  <div key={index} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Certificate {index + 1} ({page.certificateTitle.split(' ')[0]})
                    </h3>
                    
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Student Name</label>
                        <input value={page.studentName} onChange={(e) => handleChange(index, 'studentName', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Date</label>
                          <input value={page.date} onChange={(e) => handleChange(index, 'date', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                          <input value={page.fromDate} onChange={(e) => handleChange(index, 'fromDate', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">College Name</label>
                        <input value={page.collegeName} onChange={(e) => handleChange(index, 'collegeName', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Project Title</label>
                        <input value={page.projectTitle} onChange={(e) => handleChange(index, 'projectTitle', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Content</label>
                        <textarea value={page.certificateContent} onChange={(e) => handleChange(index, 'certificateContent', e.target.value)} className="mt-1 w-full h-32 rounded border border-slate-300 px-3 py-2 text-sm resize-none" />
                      </div>

                      {page.certificateTitle.includes('ATTENDANCE') && (
                        <div className="p-3 bg-white border rounded space-y-2">
                          <label className="block text-[10px] font-bold text-blue-600 uppercase">Attendance Stats</label>
                          <input placeholder="Total Days" value={page.attendanceTotalDays} onChange={(e) => handleChange(index, 'attendanceTotalDays', e.target.value)} className="w-full border-b py-1 text-xs outline-none" />
                          <input placeholder="Days Attended" value={page.attendanceDaysAttended} onChange={(e) => handleChange(index, 'attendanceDaysAttended', e.target.value)} className="w-full border-b py-1 text-xs outline-none" />
                          <input placeholder="Percentage" value={page.attendancePercentage} onChange={(e) => handleChange(index, 'attendancePercentage', e.target.value)} className="w-full border-b py-1 text-xs outline-none" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={downloadPDF} className="w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 transition-colors shadow-lg">
                DOWNLOAD PDF (BOTH PAGES)
              </button>
            </form>
          </div>

          {/* Right Side: Preview (Vertical Layout) */}
          <div className="flex flex-col items-center gap-12 pb-20">
            {pagesData.map((page, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold">PAGE {index + 1} PREVIEW</span>
                <section
                  ref={setPageRef(index)}
                  className="border border-slate-300 shadow-2xl bg-white relative"
                  style={{
                    width: '794px',
                    height: '1123px',
                    backgroundImage: "url('/images/bg.png')",
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    fontFamily: "'Times New Roman', serif",
                    padding: '180px 90px 80px 90px'
                  }}
                >
                  {/* Date */}
                  <div className="text-right text-[16px] font-bold text-black mb-6">
                    {page.date}
                  </div>

                  {/* Title */}
                  <div className="text-center mb-12">
                    <h2 className="text-[20px] font-bold border-b-2 border-black inline-block pb-1 uppercase tracking-tight">
                      {page.certificateTitle}
                    </h2>
                  </div>

                  {/* Body Content */}
                  <div
                    className="text-[17px] leading-[1.8] text-justify text-black mb-8 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: parseContent(page.certificateContent, page),
                    }}
                  />

                  {/* Attendance Section */}
                  {page.certificateTitle.includes('ATTENDANCE') && (
                    <div className="mt-10 text-[16px] leading-[1.8] text-black">
                      <p className="mb-4 font-bold underline uppercase decoration-1 underline-offset-4">
                        Attendance Details
                      </p>
                      <div className="space-y-1 ml-4">
                        <p><span className="font-bold">Total No. of Days Allotted:</span> {page.attendanceTotalDays}</p>
                        <p><span className="font-bold">No. of Days Attended:</span> {page.attendanceDaysAttended}</p>
                        <p><span className="font-bold">Percentage of Attendance:</span> {page.attendancePercentage}</p>
                      </div>
                    </div>
                  )}

                  {/* Signatory */}
                  <div className="absolute right-16 bottom-36 text-right">
                    <div className="h-16"></div> {/* Space for digital signature if needed */}
                    <p className="text-[15px] font-bold uppercase">
                      {page.signatoryTitle}
                    </p>
                  </div>
                </section>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;