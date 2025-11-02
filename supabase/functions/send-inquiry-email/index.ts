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

    const managerEmail = Deno.env.get("MANAGER_EMAIL") || "operationmanager@manchyautomobile.com";

    const emailContent = `
      <h2>New Customer Inquiry</h2>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      ${carDetails ? `<p><strong>Car:</strong> ${carDetails}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    console.log("Inquiry received:", { customerName, customerEmail, inquiryType });
    console.log("Email would be sent to:", managerEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry received successfully",
        note: "Email notification logged (email service to be configured)"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});