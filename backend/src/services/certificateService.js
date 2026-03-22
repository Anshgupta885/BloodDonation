const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

/**
 * Generate a blood donation certificate PDF
 * Returns a Buffer containing the PDF
 */
async function generateCertificatePDF(donationData) {
    return new Promise((resolve, reject) => {
        try {
            const {
                certificateId,
                donorName,
                bloodGroup,
                donationDate,
                hospitalName,
                units,
                donorLevel,
                donationCount
            } = donationData;

            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            // Background gradient effect (using rectangles)
            doc.rect(0, 0, pageWidth, pageHeight)
               .fill('#fff9f9');

            // Decorative border
            doc.lineWidth(3)
               .strokeColor('#dc2626')
               .rect(30, 30, pageWidth - 60, pageHeight - 60)
               .stroke();

            // Inner border
            doc.lineWidth(1)
               .strokeColor('#fca5a5')
               .rect(40, 40, pageWidth - 80, pageHeight - 80)
               .stroke();

            // Corner decorations
            const cornerSize = 30;
            const corners = [
                [50, 50], 
                [pageWidth - 50 - cornerSize, 50],
                [50, pageHeight - 50 - cornerSize],
                [pageWidth - 50 - cornerSize, pageHeight - 50 - cornerSize]
            ];
            
            corners.forEach(([x, y]) => {
                doc.circle(x + cornerSize/2, y + cornerSize/2, 8)
                   .fill('#dc2626');
            });

            // Header - Blood Drop Icon (simplified)
            const centerX = pageWidth / 2;
            
            doc.save()
               .translate(centerX - 25, 60)
               .path('M25,0 C25,0 50,35 50,50 C50,65 39,75 25,75 C11,75 0,65 0,50 C0,35 25,0 25,0 Z')
               .fill('#dc2626')
               .restore();

            // Title
            doc.fontSize(36)
               .fillColor('#1f2937')
               .font('Helvetica-Bold')
               .text('Certificate of Blood Donation', 0, 150, {
                   align: 'center',
                   width: pageWidth
               });

            // Subtitle
            doc.fontSize(14)
               .fillColor('#6b7280')
               .font('Helvetica')
               .text('This certificate is presented to', 0, 200, {
                   align: 'center',
                   width: pageWidth
               });

            // Donor Name
            doc.fontSize(32)
               .fillColor('#dc2626')
               .font('Helvetica-Bold')
               .text(donorName, 0, 230, {
                   align: 'center',
                   width: pageWidth
               });

            // Decorative line under name
            const lineWidth = 300;
            doc.strokeColor('#fca5a5')
               .lineWidth(2)
               .moveTo(centerX - lineWidth/2, 275)
               .lineTo(centerX + lineWidth/2, 275)
               .stroke();

            // Recognition text
            doc.fontSize(14)
               .fillColor('#374151')
               .font('Helvetica')
               .text(
                   'In recognition of their generous blood donation, helping save lives in our community.',
                   100, 295,
                   { align: 'center', width: pageWidth - 200 }
               );

            // Details section
            const detailsY = 350;
            const detailsBoxWidth = 180;
            const detailsSpacing = 200;
            const startX = (pageWidth - (detailsSpacing * 3 + detailsBoxWidth)) / 2 + 50;

            const details = [
                { label: 'Blood Group', value: bloodGroup, icon: '🩸' },
                { label: 'Units Donated', value: `${units} Unit${units > 1 ? 's' : ''}`, icon: '💉' },
                { label: 'Donation Date', value: format(new Date(donationDate), 'MMM dd, yyyy'), icon: '📅' },
                { label: 'Donor Level', value: donorLevel || 'Bronze', icon: '🏅' }
            ];

            details.forEach((detail, index) => {
                const x = startX + (index * detailsSpacing);
                
                // Detail box
                doc.roundedRect(x, detailsY, detailsBoxWidth, 70, 8)
                   .fillAndStroke('#fff', '#e5e7eb');
                
                // Label
                doc.fontSize(10)
                   .fillColor('#6b7280')
                   .font('Helvetica')
                   .text(detail.label, x, detailsY + 15, {
                       width: detailsBoxWidth,
                       align: 'center'
                   });
                
                // Value
                doc.fontSize(18)
                   .fillColor('#1f2937')
                   .font('Helvetica-Bold')
                   .text(detail.value, x, detailsY + 35, {
                       width: detailsBoxWidth,
                       align: 'center'
                   });
            });

            // Hospital info
            doc.fontSize(12)
               .fillColor('#374151')
               .font('Helvetica')
               .text(`Donated at: ${hospitalName}`, 0, detailsY + 95, {
                   align: 'center',
                   width: pageWidth
               });

            // Certificate ID
            doc.fontSize(10)
               .fillColor('#9ca3af')
               .text(`Certificate ID: ${certificateId}`, 0, detailsY + 115, {
                   align: 'center',
                   width: pageWidth
               });

            // Impact message
            doc.fontSize(16)
               .fillColor('#059669')
               .font('Helvetica-Bold')
               .text('❤️ Your donation can help save up to 3 lives! ❤️', 0, detailsY + 150, {
                   align: 'center',
                   width: pageWidth
               });

            // Footer - Signature line
            const signatureY = pageHeight - 120;
            
            doc.strokeColor('#d1d5db')
               .lineWidth(1)
               .moveTo(centerX - 100, signatureY)
               .lineTo(centerX + 100, signatureY)
               .stroke();
            
            doc.fontSize(10)
               .fillColor('#6b7280')
               .font('Helvetica')
               .text('Authorized Signature', 0, signatureY + 10, {
                   align: 'center',
                   width: pageWidth
               });

            // Footer text
            doc.fontSize(9)
               .fillColor('#9ca3af')
               .text('Blood Donation Platform - Saving Lives Together', 0, pageHeight - 60, {
                   align: 'center',
                   width: pageWidth
               });

            // Total donations badge (if applicable)
            if (donationCount && donationCount > 1) {
                doc.save()
                   .roundedRect(pageWidth - 150, 60, 100, 40, 5)
                   .fill('#fef3c7')
                   .restore();
                
                doc.fontSize(8)
                   .fillColor('#92400e')
                   .font('Helvetica')
                   .text('Total Donations', pageWidth - 150, 68, {
                       width: 100,
                       align: 'center'
                   });
                
                doc.fontSize(16)
                   .fillColor('#d97706')
                   .font('Helvetica-Bold')
                   .text(`#${donationCount}`, pageWidth - 150, 82, {
                       width: 100,
                       align: 'center'
                   });
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Generate certificate and return as base64
 */
async function generateCertificateBase64(donationData) {
    const buffer = await generateCertificatePDF(donationData);
    return buffer.toString('base64');
}

module.exports = {
    generateCertificatePDF,
    generateCertificateBase64
};
