// Edge function: weekly-coach
// Reçoit le bilan KPI de la semaine + règles finance, appelle Gemini via
// Lovable AI Gateway et renvoie un rapport business structuré.

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Payload = {
  week_start: string;
  week_end: string;
  kpi: Record<string, unknown>;
  products: Array<{ slug: string; name: string; offers: string[] }>;
  finance_rules: { pub_pct: number; stock_pct: number; epargne_pct: number; perso_pct: number };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    const { kpi, products, finance_rules, week_start, week_end } = body;

    const systemPrompt = `Tu es le coach business personnel du fondateur de "Vieux KOUKA",
une marque africaine qui vend deux produits naturels: la Poudre KOUKA (santé digestive,
hémorroïdes, ulcères) et le Sirop KOUKA (vitalité masculine, intimité). Tu analyses les
chiffres de la semaine et tu donnes des conseils CONCRETS, CHIFFRÉS, ACTIONNABLES en français.
Tu parles direct, comme un grand frère qui veut le succès du business. Tu utilises des
emojis avec parcimonie. Tu ne fais JAMAIS de blabla générique.`;

    const userPrompt = `BILAN SEMAINE du ${week_start} au ${week_end}

KPI BRUTS (le profit_net est DÉJÀ calculé après TOUTES les charges :
COGS = PA produit × unités vendues, frais livraison = 2 000 × livrées,
+ pub/salaires/autres saisis en Compta. Le rachat de stock est EXCLU
du profit car déjà comptabilisé via le PA à la vente — il apparaît
uniquement dans cash_out pour la trésorerie). Utilise profit_net tel quel
pour la répartition financière, ne le recalcule pas.

${JSON.stringify(kpi, null, 2)}

PRODUITS EN VENTE:
${JSON.stringify(products, null, 2)}

RÈGLES DE RÉPARTITION DU PROFIT (à appliquer sur profit_net) :
- ${finance_rules.pub_pct}% → Publicité semaine prochaine
- ${finance_rules.stock_pct}% → Réapprovisionnement stock
- ${finance_rules.epargne_pct}% → Épargne / trésorerie
- ${finance_rules.perso_pct}% → Rémunération perso

Analyse tout et appelle l'outil "weekly_report" avec ton diagnostic complet.`;

    const tools = [
      {
        type: 'function',
        function: {
          name: 'weekly_report',
          description: 'Rapport business hebdomadaire structuré',
          parameters: {
            type: 'object',
            properties: {
              report_markdown: {
                type: 'string',
                description: 'Rapport complet en markdown. Sections obligatoires: ## 🎯 Diagnostic — ## ✅ Ce qui marche — ## 🚨 Ce qui bloque — ## 🛠 Audit pages de vente — ## 📋 Plan d\'action 7 jours (3-5 actions concrètes priorisées)',
              },
              finance_reco: {
                type: 'object',
                properties: {
                  profit_net: { type: 'number', description: 'Profit net calculé en FCFA' },
                  pub_budget: { type: 'number', description: 'Budget pub semaine prochaine en FCFA' },
                  pub_daily: { type: 'number', description: 'Budget pub journalier suggéré' },
                  pub_focus: { type: 'string', enum: ['kouka', 'sirop-kouka', 'mixte'], description: 'Produit à mettre en avant en pub' },
                  stock_budget: { type: 'number', description: 'Budget rachat stock en FCFA' },
                  stock_priorite: { type: 'string', description: 'Produit à racheter en priorité avec quantité suggérée' },
                  epargne: { type: 'number', description: 'Montant à épargner' },
                  perso: { type: 'number', description: 'Rémunération perso' },
                  raison: { type: 'string', description: 'Justification courte (2-3 phrases) du pourquoi de cette répartition' },
                },
                required: ['profit_net', 'pub_budget', 'pub_daily', 'pub_focus', 'stock_budget', 'stock_priorite', 'epargne', 'perso', 'raison'],
                additionalProperties: false,
              },
              alerts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    severity: { type: 'string', enum: ['info', 'warning', 'danger'] },
                    message: { type: 'string' },
                  },
                  required: ['severity', 'message'],
                  additionalProperties: false,
                },
              },
              score: { type: 'number', description: 'Score santé business sur 100' },
            },
            required: ['report_markdown', 'finance_reco', 'alerts', 'score'],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools,
        tool_choice: { type: 'function', function: { name: 'weekly_report' } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error('AI gateway error', aiRes.status, txt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: 'Trop de requêtes, réessaie dans quelques secondes' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits Lovable AI épuisés — recharge dans Settings > Workspace > Usage' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('Pas de tool_call dans la réponse IA');

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('weekly-coach error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
