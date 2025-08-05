import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  organizationId: number;
  organizationName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, organizationId, organizationName }: InvitationRequest = await req.json();

    // Initialize Supabase client and Resend
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Create an encrypted token containing the organization ID
    const tokenData = {
      organizationId,
      organizationName,
      email,
      timestamp: Date.now(),
    };

    // Simple base64 encoding for the token (in production, use proper encryption)
    const token = btoa(JSON.stringify(tokenData));
    
    // Generate the invitation link
    const invitationLink = `${req.headers.get('origin') || 'http://localhost:5173'}/signup?invitation=${token}`;

    // Create the user in Supabase Auth (without password)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: {
        organization_id: organizationId,
        organization_name: organizationName,
        role_id: 1001, // Affiliate role
      },
    });

    // Check if user already exists (handle gracefully)
    let userId = authUser.user?.id;
    
    if (authError && authError.message.includes("already been registered")) {
      // User already exists, get their ID
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
      userId = existingUser.user?.id;
      console.log(`User ${email} already exists, using existing account`);
    } else if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    // Send invitation email using Resend
    const emailResponse = await resend.emails.send({
      from: `${organizationName} <noreply@contact.rolinko.com>`,
      to: [email],
      subject: `Invitation to join ${organizationName}`,
      html: `
        <h1>You're invited to join ${organizationName}!</h1>
        <p>You have been invited to join <strong>${organizationName}</strong> as an affiliate partner.</p>
        <p>Click the link below to complete your registration:</p>
        <a href="${invitationLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">
          Accept Invitation
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; word-break: break-all;">
          ${invitationLink}
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        invitationLink, // In production, don't return this
        userId: authUser.user?.id,
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);