import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    const payload = await req.json()
    
    if (payload.type === 'InvoiceSettled') {
      const invoiceId = payload.invoiceId

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error } = await supabase
        .from('payments')
        .update({ status: 'settled' })
        .eq('invoice_id', invoiceId)

      if (error) throw error
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    })
  }
})