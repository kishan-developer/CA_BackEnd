module.exports = function bookingConfirmationTemplate(userName, bookingId, amount, status) {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 32px; background-color: #ffffff; color: #333;">
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="background-color: #4f46e5; color: white; width: 64px; height: 64px; line-height: 64px; border-radius: 16px; display: inline-block; font-size: 24px; font-weight: bold;">AS</div>
            <h1 style="color: #111827; margin-top: 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">Adshelter</h1>
        </div>
        
        <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Booking Confirmed! 🎉</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
            Hi <strong>${userName}</strong>, your ad space booking has been successfully initialized. We're excited to help you reach your audience.
        </p>

        <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #374151; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Manifest Details</h3>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 14px;">Booking ID:</span>
                <span style="color: #111827; font-size: 14px; font-weight: 600;">#${bookingId}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 14px;">Amount Paid:</span>
                <span style="color: #111827; font-size: 14px; font-weight: 600;">₹${amount.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">Status:</span>
                <span style="background-color: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">${status}</span>
            </div>
        </div>

        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 32px;">
            Our deployment team is now reviewing your creative assets. You can monitor the live sync status from your dashboard.
        </p>

        <div style="text-align: center;">
            <a href="https://adshelter.in/user/bookings" style="background-color: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">View Dashboard</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated operational notification from the Adshelter platform.<br/>
            &copy; 2026 Adshelter India. All rights reserved.
        </p>
    </div>
    `;
};
