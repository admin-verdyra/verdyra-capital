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

    const result = await resend.emails.send({
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


    if (result.error) {

      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        {
          status: 500,
        }
      );
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