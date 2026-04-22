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
  signatureImage: string;
  wishMessage: string;
  internshipTitle: string;
  internshipCompletionTitle: string;
  position: string;
  department: string;
  reportingManager: string;
  location: string;
  // ✅ HIDE FLAGS
  hideReportingManager: boolean;
  hidePosition: boolean;
  hideDepartment: boolean;
  hideLocation: boolean;
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
    'This is to certify that {{student Name}} final year M.Sc Computer Science student of {{college Name}} has successfully attended the project work titled "{{project Title}}" at Pavitha Consultancy Services from {{from Date}} to {{to Date}}. During this period, the student was present and actively participated in all the scheduled sessions. The student has demonstrated consistent attendance and engagement throughout the period.',

  signatoryTitle: 'For PCS Software Solutions',
  attendanceTotalDays: '84 (exclude Sundays and other government holidays)',
  attendanceDaysAttended: '73',
  attendancePercentage: '87%',
  signatureImage: "/images/signature.png",
  wishMessage: "We wish every success in her future career.",
  internshipTitle: "Internship cum College Project",
  internshipCompletionTitle: "Internship Completion Certificate",
  position: "Intern – Project Trainee",
  department: "Business Analyst",
  reportingManager: "Surya G, Training Head",
  location: "Surandai-Tenkasi, Tamil Nadu",
  hideReportingManager: false,
  hidePosition: false,
  hideDepartment: false,
  hideLocation: false,
};

const defaultPages: CertificateFields[] = [
  {
    ...defaultFields,
    certificateTitle: 'ATTENDANCE CERTIFICATE',
  },
  {
    ...defaultFields,
    certificateTitle: 'PROJECT COMPLETION CERTIFICATE',
    certificateContent: `This is to certify that {{student Name}}, a student of {{college Name}} in M.Sc Computer Science, has successfully completed the project titled "{{project Title}}" under the guidance of PCS Software Solutions from {{from Date}} to {{to Date}}. The performance during this period was found to be satisfactory.`, wishMessage: "We wish the student all the best in all future endeavours."
  },
  {
    ...defaultFields,
    certificateTitle: 'ACCEPTANCE CERTIFICATE',
    certificateContent: `Dear {{student Name}},

We are pleased to inform you that you have been selected to undergo an {{internship Title}} at **PCS Software Solutions**, as part of your academic curriculum.

**Internship & Project Details:**
• **Position:** {{position}}
• **Department:** {{department}}
• **Internship Duration:** {{from Date}} to {{to Date}}
• **College:** {{college Name}}
• **Reporting Manager:** {{reportingManager}}
• **Location:** {{location}}

This internship offers practical exposure and guided project work under professional mentorship, aligned with academic requirements and university standards. You are also expected to maintain professional conduct and follow company rules and confidentiality policies throughout the internship.

Upon successful completion, you will receive an {{internship Completion Title}} and a **Project Evaluation Letter**, and we look forward to supporting your academic and professional growth.

Warm regards,

**FOR PCS SOFTWARE SOLUTIONS**`
  }
];

const App: React.FC = () => {
  const [pagesData, setPagesData] = useState<CertificateFields[]>(defaultPages);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const textareaRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  const parseContent = (content: string, page: CertificateFields) => {
    let parsed = content;

    const isAcceptance = page.certificateTitle.includes('ACCEPTANCE');

    // Conditional replacements based on hide flags
    let positionText = page.position;
    let departmentText = page.department;
    let reportingManagerText = page.reportingManager;
    let locationText = page.location;

    if (page.hidePosition) positionText = '';
    if (page.hideDepartment) departmentText = '';
    if (page.hideReportingManager) reportingManagerText = '';
    if (page.hideLocation) locationText = '';

    parsed = parsed
      .replace(/{{student Name}}/g, `<strong>${page.studentName}</strong>`)
      .replace(
        /{{college Name}}/g,
        isAcceptance ? `${page.collegeName}` : `<strong>${page.collegeName}</strong>`
      )
      .replace(
        /{{from Date}}/g,
        isAcceptance ? `${page.fromDate}` : `<strong>${page.fromDate}</strong>`
      )
      .replace(
        /{{to Date}}/g,
        isAcceptance ? `${page.toDate}` : `<strong>${page.toDate}</strong>`
      )
      .replace(/{{project Title}}/g, `<strong>${page.projectTitle}</strong>`)
      .replace(/{{internship Title}}/g, `<strong>${page.internshipTitle}</strong>`)
      .replace(/{{internship Completion Title}}/g, `<strong>${page.internshipCompletionTitle}</strong>`)
      .replace(/{{position}}/g, positionText)
      .replace(/{{department}}/g, departmentText)
      .replace(/{{reportingManager}}/g, reportingManagerText)
      .replace(/{{location}}/g, locationText);

    // Remove empty bullet points if fields are hidden
    if (page.hidePosition) {
      parsed = parsed.replace(/•\s*\*\*Position:\*\*\s*\n?/g, '');
    }
    if (page.hideDepartment) {
      parsed = parsed.replace(/•\s*\*\*Department:\*\*\s*\n?/g, '');
    }
    if (page.hideReportingManager) {
      parsed = parsed.replace(/•\s*\*\*Reporting Manager:\*\*\s*\n?/g, '');
    }
    if (page.hideLocation) {
      parsed = parsed.replace(/•\s*\*\*Location:\*\*\s*\n?/g, '');
    }

    // Clean up multiple consecutive newlines
    parsed = parsed.replace(/\n\s*\n\s*\n/g, '\n\n');

    parsed = parsed.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
    return parsed;
  };

  const setPageRef = (index: number) => (element: HTMLElement | null) => {
    pageRefs.current[index] = element;
  };

  const handleChange = (index: number, key: keyof CertificateFields, value: any) => {
    setPagesData((current) =>
      current.map((page, pageIndex) => {
        if (pageIndex !== index) return page;

        let updatedPage = { ...page, [key]: value };

        if (
          key === 'attendanceTotalDays' ||
          key === 'attendanceDaysAttended'
        ) {
          const total = parseInt(updatedPage.attendanceTotalDays);
          const attended = parseInt(updatedPage.attendanceDaysAttended);

          if (!isNaN(total) && !isNaN(attended) && total > 0) {
            const percentage = ((attended / total) * 100).toFixed(0);
            updatedPage.attendancePercentage = `${percentage}%`;
          } else {
            updatedPage.attendancePercentage = '';
          }
        }

        return updatedPage;
      })
    );
  };

  const downloadBothPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (!page) continue;

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i !== 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    pdf.save(`Certificates_${pagesData[0].studentName}.pdf`);
  };

  const downloadSinglePDF = async (index: number) => {
    const page = pageRefs.current[index];
    if (!page) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(
        `${pagesData[index].certificateTitle}_${pagesData[index].studentName}.pdf`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">

          {/* Left Side: Input Form */}
          <div className="h-fit lg:sticky lg:top-10">
            <form className="space-y-6 rounded-lg border border-slate-300 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-blue-900 border-b pb-2">Certificate Editor</h2>

              <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-8">
                {pagesData.map((page, index) => (
                  <div key={index} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Certificate {index + 1} ({page.certificateTitle.split(' ')[0]})
                    </h3>

                    <div>
                      <label className="block text-[10px] font-bold uppercase">Date</label>
                      <input
                        value={page.date}
                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                        className="mt-1 w-full border px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Certificate Title
                      </label>
                      <input
                        value={page.certificateTitle}
                        onChange={(e) => handleChange(index, 'certificateTitle', e.target.value.toUpperCase())}
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid gap-3">
                      <div className="grid gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase">Student Name</label>
                          <input
                            value={page.studentName}
                            onChange={(e) =>
                              handleChange(index, 'studentName', e.target.value.toUpperCase())
                            }
                            className="mt-1 w-full border px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase">College Name</label>
                          <input
                            value={page.collegeName}
                            onChange={(e) => handleChange(index, 'collegeName', e.target.value)}
                            className="mt-1 w-full border px-3 py-2 text-sm"
                          />
                        </div>

                        {!page.certificateTitle.includes('ACCEPTANCE') && (
                          <div>
                            <label className="block text-[10px] font-bold uppercase">
                              Project Title
                            </label>
                            <input
                              value={page.projectTitle}
                              onChange={(e) => handleChange(index, 'projectTitle', e.target.value)}
                              className="mt-1 w-full border px-3 py-2 text-sm"
                            />
                          </div>
                        )}

                        <div className="grid gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase">From Date</label>
                            <input
                              value={page.fromDate}
                              onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
                              className="mt-1 w-full border px-3 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase">To Date</label>
                            <input
                              value={page.toDate}
                              onChange={(e) => handleChange(index, 'toDate', e.target.value)}
                              className="mt-1 w-full border px-3 py-2 text-sm"
                            />
                          </div>

                          {page.certificateTitle.includes('ACCEPTANCE') && (
                            <>
                              <div>
                                <label className="block text-[10px] font-bold uppercase">Internship Title</label>
                                <input
                                  value={page.internshipTitle}
                                  onChange={(e) => handleChange(index, 'internshipTitle', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                />
                              </div>

                              {/* POSITION with Hide Checkbox */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="block text-[10px] font-bold uppercase">Position</label>
                                  <label className="flex items-center gap-1 text-[9px]">
                                    <input
                                      type="checkbox"
                                      checked={page.hidePosition}
                                      onChange={(e) => handleChange(index, 'hidePosition', e.target.checked)}
                                      className="w-3 h-3"
                                    />
                                    
                                  </label>
                                </div>
                                <input
                                  value={page.position}
                                  onChange={(e) => handleChange(index, 'position', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                  disabled={page.hidePosition}
                                />
                              </div>

                              {/* DEPARTMENT with Hide Checkbox */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="block text-[10px] font-bold uppercase">Department</label>
                                  <label className="flex items-center gap-1 text-[9px]">
                                    <input
                                      type="checkbox"
                                      checked={page.hideDepartment}
                                      onChange={(e) => handleChange(index, 'hideDepartment', e.target.checked)}
                                      className="w-3 h-3"
                                    />
                                    {/* Hide from certificate */}
                                  </label>
                                </div>
                                <input
                                  value={page.department}
                                  onChange={(e) => handleChange(index, 'department', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                  disabled={page.hideDepartment}
                                />
                              </div>

                              {/* REPORTING MANAGER with Hide Checkbox */}
                              <div>
                                {/* <div className="flex items-center justify-between"> */}
                                <div className="flex items-center gap-2">
                                  <label className="block text-[10px] font-bold uppercase">Reporting Manager</label>
                                  <label className="flex items-center gap-1 text-[9px]">
                                    <input
                                      type="checkbox"
                                      checked={page.hideReportingManager}
                                      onChange={(e) => handleChange(index, 'hideReportingManager', e.target.checked)}
                                      className="w-3 h-3"
                                    />
                                    {/* Hide from certificate */}
                                  </label>
                                </div>
                                <input
                                  value={page.reportingManager}
                                  onChange={(e) => handleChange(index, 'reportingManager', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                  disabled={page.hideReportingManager}
                                />
                              </div>

                              {/* LOCATION with Hide Checkbox */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="block text-[10px] font-bold uppercase">Location</label>
                                  <label className="flex items-center gap-1 text-[9px]">
                                    <input
                                      type="checkbox"
                                      checked={page.hideLocation}
                                      onChange={(e) => handleChange(index, 'hideLocation', e.target.checked)}
                                      className="w-3 h-3"
                                    />
                                    {/* Hide from certificate */}
                                  </label>
                                </div>
                                <input
                                  value={page.location}
                                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                  disabled={page.hideLocation}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase">Internship Completion</label>
                                <input
                                  value={page.internshipCompletionTitle}
                                  onChange={(e) => handleChange(index, 'internshipCompletionTitle', e.target.value)}
                                  className="mt-1 w-full border px-3 py-2 text-sm"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Signature Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                handleChange(index, 'signatureImage', reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="mt-1 w-full text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Content
                        </label>

                        <textarea
                          ref={(el) => (textareaRefs.current[index] = el)}
                          value={page.certificateContent}
                          onChange={(e) =>
                            handleChange(index, 'certificateContent', e.target.value)
                          }
                          className="mt-1 w-full h-32 border px-3 py-2 text-sm"
                        />

                        <select
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value) return;

                            const textarea = textareaRefs.current[index];
                            if (!textarea) return;

                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentText = page.certificateContent;
                            let newText;

                            if (start !== null && end !== null) {
                              newText =
                                currentText.substring(0, start) +
                                value +
                                currentText.substring(end);
                            } else {
                              newText = currentText + " " + value;
                            }

                            handleChange(index, "certificateContent", newText);

                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd =
                                start + value.length;
                              textarea.focus();
                            }, 0);
                          }}
                        >
                          <option value="">-- Insert Field --</option>
                          <option value="{{student Name}}">Student Name</option>
                          <option value="{{college Name}}">College Name</option>
                          <option value="{{from Date}}">From Date</option>
                          <option value="{{to Date}}">To Date</option>
                          <option value="{{project Title}}">Project Title</option>
                          <option value="{{internship Title}}">Internship Title</option>
                          <option value="{{position}}">Position</option>
                          <option value="{{department}}">Department</option>
                          <option value="{{reportingManager}}">Reporting Manager</option>
                          <option value="{{location}}">Location</option>
                          <option value="{{internship Completion Title}}">Internship Completion Title</option>
                        </select>
                      </div>

                      {page.certificateTitle.includes('ATTENDANCE') && (
                        <div className="p-3 bg-white border rounded space-y-2">
                          <label className="block text-[10px] font-bold text-blue-600 uppercase">Attendance Stats</label>
                          <input placeholder="Total Days" value={page.attendanceTotalDays} onChange={(e) => handleChange(index, 'attendanceTotalDays', e.target.value)} className="w-full border-b py-1 text-xs outline-none" />
                          <input placeholder="Days Attended" value={page.attendanceDaysAttended} onChange={(e) => handleChange(index, 'attendanceDaysAttended', e.target.value)} className="w-full border-b py-1 text-xs outline-none" />
                          <input
                            placeholder="Percentage"
                            value={page.attendancePercentage}
                            readOnly
                            className="w-full border-b py-1 text-xs outline-none bg-gray-100"
                          />
                        </div>
                      )}
                    </div>

                    {!page.certificateTitle.includes('ACCEPTANCE') && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Wish Message
                        </label>
                        <textarea
                          value={page.wishMessage}
                          onChange={(e) => handleChange(index, 'wishMessage', e.target.value)}
                          className="mt-1 w-full h-20 rounded border border-slate-300 px-3 py-2 text-sm resize-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={downloadBothPDF} className="w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 transition-colors shadow-lg">
                DOWNLOAD PDF (BOTH PAGES)
              </button>
            </form>
          </div>

          {/* Right Side: Preview */}
          <div className="flex flex-col items-center gap-12 pb-20">
            {pagesData.map((page, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => downloadSinglePDF(index)}
                    className="inline-flex items-center gap-1 bg-blue-900 text-white text-xs px-3 py-1 rounded-full shadow-md hover:scale-105 hover:bg-blue-800 transition-all duration-200"
                  >
                    ⬇ Download
                  </button>
                </div>
                <span className="bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold">PAGE {index + 1} PREVIEW</span>

                <section
                  ref={setPageRef(index)}
                  className="border border-slate-300 shadow-2xl bg-white flex flex-col"
                  style={{
                    width: '794px',
                    height: '1123px',
                    backgroundImage: "url('/images/bg.png')",
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    fontFamily: "'Times New Roman', serif",
                    padding: page.certificateTitle.includes('ACCEPTANCE')
                      ? '150px 80px 60px 80px'
                      : '180px 90px 80px 90px'
                  }}
                >
                  <div className="text-right text-[16px] font-bold text-black mb-6">
                    {page.date}
                  </div>

                  <div className="text-center mb-2">
                    <h2 className="text-[20px] font-bold border-b-2 border-black inline-block pb-2 mb-2 uppercase tracking-tight">
                      {page.certificateTitle}
                    </h2>
                  </div>

                  <div>
                    <div
                      className={`text-[15px] text-justify text-black whitespace-pre-line ${
                        page.certificateTitle.includes('ACCEPTANCE')
                          ? 'leading-[1.5] mb-3'
                          : 'leading-[1.8] mb-8'
                      }`}
                      style={{
                        textIndent: page.certificateTitle.includes('ACCEPTANCE') ? "0px" : "40px"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: parseContent(page.certificateContent, page),
                      }}
                    />

                    {page.certificateTitle.includes('ATTENDANCE') && (
                      <div className="mt-6 text-[16px] leading-[1.8] text-black">
                        <p className="mb-3 font-bold uppercase text-left">Attendance Details</p>
                        <div className="space-y-1 ml-4 text-left">
                          <p><span className="font-bold">Total No. of Days Allotted:</span> {page.attendanceTotalDays}</p>
                          <p><span className="font-bold">No. of Days Attended:</span> {page.attendanceDaysAttended}</p>
                          <p><span className="font-bold">Percentage of Attendance:</span> {page.attendancePercentage}</p>
                        </div>
                      </div>
                    )}

                    {!page.certificateTitle.includes('ACCEPTANCE') && (
                      <p
                        className="mt-8 text-left text-[17px] leading-[1.8] text-black font-normal"
                        dangerouslySetInnerHTML={{
                          __html: page.wishMessage.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        }}
                      />
                    )}
                  </div>

                  <div
                    className={`flex flex-col ${page.certificateTitle.includes('ACCEPTANCE')
                      ? 'items-start mt-6'
                      : 'items-end mt-16'
                    }`}
                  >
                    <div
                      className={`${page.certificateTitle.includes('ACCEPTANCE')
                        ? 'text-left'
                        : 'pr-4 text-center'
                      }`}
                    >
                      {page.signatureImage && (
                        <img
                          src={page.signatureImage}
                          alt="signature"
                          className="w-32 h-auto mb-2 mx-auto"
                        />
                      )}
                      {page.certificateTitle.includes('ACCEPTANCE') ? (
                        <>
                          <p className="text-[14px] mt-2 font-bold">
                            Mahalakshmi Ganesan
                          </p>
                          <p className="text-[13px]">
                            Director
                          </p>
                        </>
                      ) : (
                        <p className="text-[15px] font-bold uppercase">
                          {page.signatoryTitle}
                        </p>
                      )}
                    </div>
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