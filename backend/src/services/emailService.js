const nodemailer = require('nodemailer');

// Create transporter - configure based on your email provider
// For production, use environment variables
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

/**
 * Send email notification
 */
async function sendEmail(to, subject, html, text = null) {
    // Skip if email is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.log('Email service not configured. Skipping email to:', to);
        return { success: false, message: 'Email service not configured' };
    }

    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.SMTP_FROM || `"Blood Donation Platform" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text: text || subject
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send blood request creation notification
 */
async function sendRequestCreatedEmail(requesterEmail, requestDetails) {
    const { patientName, bloodGroup, units, urgency, city, byDate } = requestDetails;
    
    const subject = `Blood Request Created - ${bloodGroup} Blood Needed`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff3b5c, #ff6b35); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🩸 Blood Request Created</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
                <p>Your blood request has been successfully created. Here are the details:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold;">Patient Name:</td>
                        <td style="padding: 10px;">${patientName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold;">Blood Group:</td>
                        <td style="padding: 10px; color: #ff3b5c; font-weight: bold;">${bloodGroup}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold;">Units Required:</td>
                        <td style="padding: 10px;">${units}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold;">Urgency:</td>
                        <td style="padding: 10px; color: ${urgency === 'Critical' ? '#dc2626' : '#f59e0b'};">${urgency}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold;">City:</td>
                        <td style="padding: 10px;">${city}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Required By:</td>
                        <td style="padding: 10px;">${new Date(byDate).toLocaleDateString()}</td>
                    </tr>
                </table>
                <p>We will notify matching donors in your area. You'll receive updates when donors respond.</p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Blood Donation Platform - Saving Lives Together</p>
            </div>
        </div>
    `;
    
    return sendEmail(requesterEmail, subject, html);
}

/**
 * Send emergency broadcast to eligible donors
 */
async function sendEmergencyBroadcastEmail(donorEmails, requestDetails) {
    const { patientName, bloodGroup, units, urgency, city, contactPhone, hospital } = requestDetails;
    
    const subject = `🚨 URGENT: ${bloodGroup} Blood Needed - ${urgency}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🚨 Emergency Blood Request</h1>
            </div>
            <div style="padding: 30px; background: #fef2f2; border: 2px solid #fecaca;">
                <p style="font-size: 18px; color: #991b1b; font-weight: bold;">
                    Your blood type (${bloodGroup}) is urgently needed!
                </p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #fecaca;">
                        <td style="padding: 10px; font-weight: bold;">Location:</td>
                        <td style="padding: 10px;">${hospital || city}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #fecaca;">
                        <td style="padding: 10px; font-weight: bold;">Blood Group:</td>
                        <td style="padding: 10px; color: #dc2626; font-weight: bold; font-size: 20px;">${bloodGroup}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #fecaca;">
                        <td style="padding: 10px; font-weight: bold;">Units Needed:</td>
                        <td style="padding: 10px;">${units}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #fecaca;">
                        <td style="padding: 10px; font-weight: bold;">Urgency Level:</td>
                        <td style="padding: 10px; color: #dc2626; font-weight: bold;">${urgency}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Contact:</td>
                        <td style="padding: 10px;">${contactPhone}</td>
                    </tr>
                </table>
                <div style="text-align: center; margin: 30px 0;">
                    <p style="margin-bottom: 20px;">If you can help, please respond immediately!</p>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/donor" 
                       style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                        Respond Now
                    </a>
                </div>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>You're receiving this because you're registered as an eligible donor for ${bloodGroup} blood.</p>
                <p>Blood Donation Platform - Every Drop Counts</p>
            </div>
        </div>
    `;
    
    // Send to all donors (batch)
    const results = await Promise.allSettled(
        donorEmails.map(email => sendEmail(email, subject, html))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    return { sent: successful, total: donorEmails.length };
}

/**
 * Send donor approval notification (when donor is assigned to a request)
 */
async function sendDonorApprovalEmail(donorEmail, donorName, requestDetails) {
    const { patientName, bloodGroup, hospital, city, contactPhone } = requestDetails;
    
    const subject = `🎉 Thank You for Responding - Blood Donation Request`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🎉 Response Confirmed!</h1>
            </div>
            <div style="padding: 30px; background: #f0fdf4;">
                <p style="font-size: 18px;">Dear <strong>${donorName}</strong>,</p>
                <p>Thank you for responding to the blood request! Your willingness to help save a life is truly appreciated.</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #bbf7d0;">
                    <h3 style="color: #059669; margin-top: 0;">📋 Request Details</h3>
                    <p><strong>Patient:</strong> ${patientName}</p>
                    <p><strong>Blood Group:</strong> <span style="color: #dc2626; font-weight: bold;">${bloodGroup}</span></p>
                    <p><strong>Location:</strong> ${hospital || city}</p>
                    <p><strong>Contact:</strong> ${contactPhone}</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>The requester will contact you shortly to coordinate the donation.</li>
                    <li>Please ensure you're in good health before donating.</li>
                    <li>Bring a valid ID when you visit the donation center.</li>
                </ol>
                
                <p style="color: #059669; font-weight: bold;">Thank you for being a hero! ❤️</p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Blood Donation Platform - Saving Lives Together</p>
            </div>
        </div>
    `;
    
    return sendEmail(donorEmail, subject, html);
}

/**
 * Send donation certificate email
 */
async function sendCertificateEmail(donorEmail, donorName, certificateDetails) {
    const { certificateId, donationDate, hospitalName, bloodGroup, units } = certificateDetails;
    
    const subject = `🏅 Your Blood Donation Certificate - ${certificateId}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🏅 Donation Certificate</h1>
            </div>
            <div style="padding: 30px; background: #fffbeb;">
                <p style="font-size: 18px;">Dear <strong>${donorName}</strong>,</p>
                <p>Congratulations on your successful blood donation! Your contribution helps save lives.</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #fcd34d;">
                    <h3 style="color: #d97706; margin-top: 0; text-align: center;">Certificate Details</h3>
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 8px;"><strong>Certificate ID:</strong></td>
                            <td style="padding: 8px;">${certificateId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Donation Date:</strong></td>
                            <td style="padding: 8px;">${new Date(donationDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Hospital:</strong></td>
                            <td style="padding: 8px;">${hospitalName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Blood Group:</strong></td>
                            <td style="padding: 8px; color: #dc2626; font-weight: bold;">${bloodGroup}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;"><strong>Units Donated:</strong></td>
                            <td style="padding: 8px;">${units}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/donor/history" 
                       style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Download PDF Certificate
                    </a>
                </div>
                
                <p style="color: #92400e; text-align: center;">You've helped save up to <strong>3 lives</strong>! 🩸❤️</p>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Blood Donation Platform - Every Drop Counts</p>
            </div>
        </div>
    `;
    
    return sendEmail(donorEmail, subject, html);
}

/**
 * Send appointment reminder
 */
async function sendAppointmentReminderEmail(donorEmail, donorName, appointmentDetails) {
    const { hospitalName, scheduledDate, timeSlot, address } = appointmentDetails;
    
    const subject = `📅 Reminder: Blood Donation Appointment Tomorrow`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">📅 Appointment Reminder</h1>
            </div>
            <div style="padding: 30px; background: #eff6ff;">
                <p style="font-size: 18px;">Dear <strong>${donorName}</strong>,</p>
                <p>This is a reminder about your upcoming blood donation appointment.</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #bfdbfe;">
                    <h3 style="color: #2563eb; margin-top: 0;">📋 Appointment Details</h3>
                    <p><strong>Hospital:</strong> ${hospitalName}</p>
                    <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${timeSlot}</p>
                    <p><strong>Address:</strong> ${address}</p>
                </div>
                
                <p><strong>Preparation Tips:</strong></p>
                <ul>
                    <li>Get a good night's sleep</li>
                    <li>Eat a healthy meal before donating</li>
                    <li>Stay hydrated - drink plenty of water</li>
                    <li>Bring a valid ID</li>
                </ul>
            </div>
            <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Blood Donation Platform - Saving Lives Together</p>
            </div>
        </div>
    `;
    
    return sendEmail(donorEmail, subject, html);
}

module.exports = {
    sendEmail,
    sendRequestCreatedEmail,
    sendEmergencyBroadcastEmail,
    sendDonorApprovalEmail,
    sendCertificateEmail,
    sendAppointmentReminderEmail
};
