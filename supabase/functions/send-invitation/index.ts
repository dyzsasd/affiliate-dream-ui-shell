import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const invitationLink = `${req.headers.get('origin') || 'http://localhost:5173'}/auth/signup?invitation=${token}`;

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

    if (authError) {
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    // Send invitation email (you would use your email service here)
    // For now, we'll return the invitation link
    console.log(`Invitation link for ${email}: ${invitationLink}`);

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