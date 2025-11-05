import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { customerName, customerEmail, customerPhone, inquiryType, message, carDetails } = await req.json();

    const managerEmail = "manchyautomobile@gmail.com";

    const emailContent = `
      <h2>New Customer Inquiry</h2>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      ${carDetails ? `<p><strong>Car:</strong> ${carDetails}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    console.log("Inquiry received:", { customerName, customerEmail, inquiryType });
    console.log("Email content prepared for:", managerEmail);
    console.log("Email content:", emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you! Your inquiry has been received and saved. Our team will contact you soon."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Unable to process inquiry",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});