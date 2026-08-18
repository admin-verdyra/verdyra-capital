import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      loanType,
      businessCategory,
      monthlyTurnover,
      businessVintage,
      city,
      businessName,
      contactPerson,
      mobileNumber,
      emailAddress,
      indicativeFunding,
    } = body;

    // 1. Send lead notification to Verdyra team
    const internalEmail = await resend.emails.send({
      from: "Verdyra Capital <connect@verdyracapital.in>",
      to: ["connect@verdyracapital.in"],
      subject: "New Loan Enquiry - Verdyra Capital",
      html: `
        <h2>New Enquiry Received</h2>

        <table cellpadding="8" cellspacing="0" border="1">
          <tr><td><strong>Business Name</strong></td><td>${businessName}</td></tr>
          <tr><td><strong>Contact Person</strong></td><td>${contactPerson}</td></tr>
          <tr><td><strong>Mobile</strong></td><td>${mobileNumber}</td></tr>
          <tr><td><strong>Email</strong></td><td>${emailAddress}</td></tr>
          <tr><td><strong>Loan Type</strong></td><td>${loanType}</td></tr>
          <tr><td><strong>Business Category</strong></td><td>${businessCategory}</td></tr>
          <tr><td><strong>Monthly Turnover</strong></td><td>${monthlyTurnover}</td></tr>
          <tr><td><strong>Business Vintage</strong></td><td>${businessVintage}</td></tr>
          <tr><td><strong>City</strong></td><td>${city}</td></tr>
          <tr><td><strong>Indicative Funding</strong></td><td>${indicativeFunding}</td></tr>
        </table>
      `,
    });

    if (internalEmail.error) {
      console.error(
        "Internal enquiry email error:",
        internalEmail.error
      );

      return NextResponse.json(
        {
          success: false,
          error: internalEmail.error,
        },
        {
          status: 500,
        }
      );
    }

    // 2. Send acknowledgement email to customer
    const customerEmail = await resend.emails.send({
      from: "Verdyra Capital <connect@verdyracapital.in>",
      to: [emailAddress],
      subject: "We have received your enquiry | Verdyra Capital",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="
            margin: 0;
            padding: 0;
            background-color: #f5f7f6;
            font-family: Arial, Helvetica, sans-serif;
          ">
            <div style="
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            ">
              
              <div style="
                background: #064e3b;
                padding: 30px;
                text-align: center;
              ">
                <h1 style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 26px;
                ">
                  Verdyra Capital
                </h1>
              </div>

              <div style="padding: 35px;">
                <h2 style="
                  color: #064e3b;
                  margin-top: 0;
                ">
                  Thank you for your interest!
                </h2>

                <p style="
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.7;
                ">
                  Hi ${contactPerson || "there"},
                </p>

                <p style="
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.7;
                ">
                  Thank you for submitting your funding requirement to
                  <strong>Verdyra Capital</strong>.
                </p>

                <p style="
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.7;
                ">
                  We have successfully received your enquiry. Our team will
                  review your details and connect with you shortly to understand
                  your requirements and explore suitable financing options.
                </p>

                <div style="
                  background: #f0fdf4;
                  border-left: 4px solid #16a34a;
                  padding: 16px;
                  margin: 25px 0;
                  border-radius: 4px;
                ">
                  <p style="
                    margin: 0;
                    color: #166534;
                    font-size: 15px;
                    line-height: 1.6;
                  ">
                    <strong>Your enquiry summary</strong><br />
                    Business: ${businessName || "Not provided"}<br />
                    Loan Type: ${loanType || "Not provided"}<br />
                    City: ${city || "Not provided"}
                  </p>
                </div>

                <p style="
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.7;
                ">
                  We look forward to speaking with you.
                </p>

                <p style="
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.7;
                  margin-bottom: 0;
                ">
                  Regards,<br />
                  <strong>Team Verdyra Capital</strong>
                </p>
              </div>

              <div style="
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                color: #6b7280;
                font-size: 12px;
              ">
                Verdyra Fintech Private Limited<br />
                Verdyra Capital is a technology-enabled financing platform.
              </div>

            </div>
          </body>
        </html>
      `,
    });

    if (customerEmail.error) {
      console.error(
        "Customer acknowledgement email error:",
        customerEmail.error
      );

      // Internal lead was received successfully,
      // so we log this error but don't fail the enquiry.
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}