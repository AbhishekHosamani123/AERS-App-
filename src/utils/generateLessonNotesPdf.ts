import { jsPDF } from 'jspdf';

interface LessonNotesPdfOptions {
  language?: 'en' | 'kn';
}

export function generateLessonNotesPdf(options: LessonNotesPdfOptions = {}) {
  const { language = 'en' } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const isKannada = language === 'kn';

  // Helper function to check page overflow and add new page
  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 25) {
      doc.addPage();
      cursorY = margin + 10;
      return true;
    }
    return false;
  };

  // ---------------- PAGE 1 HEADER ----------------

  // Organization Logo / Emblem in PDF only
  const logoSize = 14;
  doc.setFillColor(8, 117, 245); // #0875F5
  doc.roundedRect(margin, cursorY, logoSize, logoSize, 3, 3, 'F');

  // Emblem icon inside logo (Star / Spark)
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + logoSize / 2, cursorY + logoSize / 2, 2.5, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(margin + logoSize / 2, cursorY + 2.5, margin + logoSize / 2, cursorY + logoSize - 2.5);
  doc.line(margin + 2.5, cursorY + logoSize / 2, margin + logoSize - 2.5, cursorY + logoSize / 2);

  // Logo Brand Text
  doc.setTextColor(16, 24, 40); // #101828
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CAREER CLARITY', margin + logoSize + 4, cursorY + 6);

  doc.setTextColor(100, 116, 139); // #64748B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CAREER READINESS & PLACEMENT MASTERCLASS', margin + logoSize + 4, cursorY + 11.5);

  // Right-aligned Metadata Badge
  doc.setFillColor(239, 246, 255); // #EFF6FF
  doc.setDrawColor(219, 234, 254); // #DBEAFE
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - margin - 48, cursorY, 48, 14, 2.5, 2.5, 'FD');

  doc.setTextColor(8, 117, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LEVEL 01 · STEP 02', pageWidth - margin - 44, cursorY + 5.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('5 MIN READ · OFFICIAL NOTES', pageWidth - margin - 44, cursorY + 10.5);

  cursorY += logoSize + 8;

  // Thin Header Divider
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // Document Title
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(isKannada ? 'Read Lesson Notes (Kannada Edition)' : 'Read Lesson Notes', margin, cursorY);
  cursorY += 6;

  // Document Subtitle
  doc.setTextColor(71, 85, 105); // #475569
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  const subtitle = 'Master the principles of authentic self-knowledge, evidence formulation, and deliberate practice.';
  doc.text(subtitle, margin, cursorY);
  cursorY += 10;

  // ---------------- SECTION 1 ----------------
  ensureSpace(35);
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. What is Self-Awareness in Career Readiness?', margin, cursorY);
  cursorY += 5.5;

  doc.setTextColor(52, 64, 84); // #344054
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const p1 = 'Self-awareness is the conscious recognition of your motivations, work habits, technical aptitudes, and areas for growth. In placement drives, recruiters prioritize self-aware candidates because they accurately articulate where they can immediately deliver value and where they require mentorship.';
  const p1Lines = doc.splitTextToSize(p1, contentWidth);
  doc.text(p1Lines, margin, cursorY, { lineHeightFactor: 1.5 });
  cursorY += p1Lines.length * 5.2 + 8;

  // ---------------- SECTION 2 ----------------
  ensureSpace(50);
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Identifying True Strengths vs. Generic Claims', margin, cursorY);
  cursorY += 5.5;

  doc.setTextColor(52, 64, 84);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const p2 = 'A genuine strength is an ability that you can consistently demonstrate through verifiable evidence. Saying "I am a quick learner and hard worker" is a claim; backing it up with a specific project story is proof.';
  const p2Lines = doc.splitTextToSize(p2, contentWidth);
  doc.text(p2Lines, margin, cursorY, { lineHeightFactor: 1.5 });
  cursorY += p2Lines.length * 5.2 + 4;

  // Formula Callout Box
  const formulaBoxHeight = 22;
  ensureSpace(formulaBoxHeight + 8);
  doc.setFillColor(239, 246, 255); // #EFF6FF
  doc.setDrawColor(191, 219, 254); // #BFDBFE
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cursorY, contentWidth, formulaBoxHeight, 2.5, 2.5, 'FD');

  doc.setTextColor(8, 117, 245); // #0875F5
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('THE STRENGTH FORMULA', margin + 6, cursorY + 6.5);

  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Core Skill  +  Project Context  +  Concrete Action  +  Measurable Result', margin + 6, cursorY + 14);
  cursorY += formulaBoxHeight + 10;

  // ---------------- SECTION 3 ----------------
  ensureSpace(60);
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Assumption vs. Concrete Evidence', margin, cursorY);
  cursorY += 6;

  // Vague Assumption Box
  const vagueBoxHeight = 18;
  doc.setFillColor(254, 242, 242); // #FEF2F2
  doc.setDrawColor(254, 202, 202); // #FECACA
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cursorY, contentWidth, vagueBoxHeight, 2, 2, 'FD');

  doc.setTextColor(153, 27, 27); // #991B1B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('X  Vague Assumption', margin + 6, cursorY + 6);

  doc.setTextColor(52, 64, 84);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('"I think I have great problem-solving skills because I enjoy coding."', margin + 6, cursorY + 12);
  cursorY += vagueBoxHeight + 4;

  // Verifiable Evidence Box
  const proofBoxHeight = 22;
  ensureSpace(proofBoxHeight + 8);
  doc.setFillColor(236, 253, 245); // #ECFDF5
  doc.setDrawColor(167, 243, 208); // #A7F3D0
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cursorY, contentWidth, proofBoxHeight, 2, 2, 'FD');

  doc.setTextColor(6, 95, 70); // #065F46
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('V  Verifiable Evidence', margin + 6, cursorY + 6);

  doc.setTextColor(52, 64, 84);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const proofText = '"Resolved asynchronous API race conditions in my final-year IoT project, reducing sensor packet drop rate by 42%."';
  const proofLines = doc.splitTextToSize(proofText, contentWidth - 12);
  doc.text(proofLines, margin + 6, cursorY + 11.5, { lineHeightFactor: 1.4 });
  cursorY += proofBoxHeight + 10;

  // ---------------- SECTION 4 ----------------
  ensureSpace(35);
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Growth Mindset & Addressing Blind Spots', margin, cursorY);
  cursorY += 5.5;

  doc.setTextColor(52, 64, 84);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const p4 = 'Every professional has areas requiring refinement. True confidence does not mean being perfect; it means proactively acknowledging your growth edges and adopting deliberate practice to improve.';
  const p4Lines = doc.splitTextToSize(p4, contentWidth);
  doc.text(p4Lines, margin, cursorY, { lineHeightFactor: 1.5 });
  cursorY += p4Lines.length * 5.2 + 8;

  // ---------------- SECTION 5 ----------------
  ensureSpace(35);
  doc.setTextColor(16, 24, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('5. The 7-Day Improvement Action Framework', margin, cursorY);
  cursorY += 5.5;

  doc.setTextColor(52, 64, 84);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const p5 = 'Career breakthroughs stem from small, consistent habits. Rather than setting vague long-term goals, commit to one specific action you will execute within the next 7 days.';
  const p5Lines = doc.splitTextToSize(p5, contentWidth);
  doc.text(p5Lines, margin, cursorY, { lineHeightFactor: 1.5 });
  cursorY += p5Lines.length * 5.2 + 8;

  // ---------------- RUNNING FOOTERS ON ALL PAGES ----------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    // Left Footer
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('CAREER CLARITY · Level 01 · Step 02 | Read Lesson Notes', margin, pageHeight - 9);

    // Right Footer
    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 9);
  }

  // Save the PDF
  const filename = `Career_Clarity_Level01_Step02_Lesson_Notes${isKannada ? '_Kannada' : ''}.pdf`;
  doc.save(filename);
}
