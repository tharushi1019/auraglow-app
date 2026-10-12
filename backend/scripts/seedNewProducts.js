/**
 * AuraGlow — Comprehensive Cosmetics & Skincare Product Expander
 * Adds 12 additional highly realistic AuraGlow branded products
 * covering every skin type, skin quiz concern, tone, and undertone.
 */

const supabase = require('../src/config/supabaseClient');

const newProducts = [
  {
    id: 'b2000000-0000-0000-0000-000000000009',
    name: 'Luminous Silk Serum Foundation',
    brand: 'AuraGlow',
    category: 'makeup',
    description: 'A weightless, breathable skincare-infused foundation with Hyaluronic Acid and Niacinamide. Delivers medium, buildable luminous coverage that feels like bare skin while smoothing texture and blurring imperfections.',
    price: 9500.00,
    stock_quantity: 65,
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
    concerns_addressed: ['dullness', 'uneven-texture'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'fragrance-free', 'paraben-free', 'silicone-free', 'non-comedogenic'],
    shades: [
      { name: '01 Fair Warm (Porcelain)', hex: '#F9E5D9', stock: 8, tone: 'light', undertone: 'warm' },
      { name: '02 Fair Cool (Alabaster)', hex: '#F6DDD2', stock: 8, tone: 'light', undertone: 'cool' },
      { name: '03 Light Neutral (Ivory)', hex: '#EED0BE', stock: 9, tone: 'light', undertone: 'neutral' },
      { name: '04 Medium Warm (Sand)', hex: '#E5BF9E', stock: 10, tone: 'medium', undertone: 'warm' },
      { name: '05 Medium Neutral (Honey)', hex: '#D6A87C', stock: 10, tone: 'medium', undertone: 'neutral' },
      { name: '06 Tan Warm (Caramel)', hex: '#C28C58', stock: 7, tone: 'tan', undertone: 'warm' },
      { name: '07 Dark Neutral (Toffee)', hex: '#9B613A', stock: 7, tone: 'dark', undertone: 'neutral' },
      { name: '08 Deep Cool (Espresso)', hex: '#5E3823', stock: 6, tone: 'deep', undertone: 'cool' }
    ],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000010',
    name: 'Niacinamide 10% + Zinc Pore Minimizing Serum',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'A clinical-strength clarifying treatment powered by 10% high-purity Niacinamide and 1% Zinc PCA. Regulates excessive sebum secretion, minimizes visibly enlarged pores, and helps banish persistent blemishes without drying.',
    price: 4900.00,
    stock_quantity: 80,
    images: [
      'https://images.unsplash.com/photo-1608248597359-5984365b2d2f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['oily', 'combination', 'normal'],
    concerns_addressed: ['acne', 'dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'fragrance-free', 'oil-free', 'sulfate-free', 'paraben-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000011',
    name: 'Centella Cica Barrier Calming Cream',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'An emergency rescue moisturizer formulated with 70% Centella Asiatica leaf water, Madecassoside, and Provitamin B5. Rapidly quenches burning sensations, soothes intense redness, and re-glues irritated moisture barriers.',
    price: 6400.00,
    stock_quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['sensitive', 'dry', 'combination'],
    concerns_addressed: ['redness', 'dehydration'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'fragrance-free', 'hypoallergenic', 'essential-oil-free', 'paraben-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000012',
    name: 'Bakuchiol & Peptide Youth Firming Elixir',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'A revolutionary bio-retinol alternative combining 2% ayurvedic Bakuchiol seed extract with firming Signal Peptides. Restores cellular bounce, plumps deep fine lines, and smooths photo-aged skin without peeling or UV sensitivity.',
    price: 10500.00,
    stock_quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'combination', 'normal', 'sensitive'],
    concerns_addressed: ['aging', 'dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'pregnancy-safe', 'paraben-free', 'sulfate-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000013',
    name: 'BHA 2% Salicylic Clarifying Exfoliant Toner',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'A gentle leave-on liquid exfoliant with 2% lipid-soluble Salicylic Acid, Green Tea catechins, and Willow Bark extract. Penetrates deep inside pore walls to unglue dead cells, banish stubborn blackheads, and prevent recurring breakouts.',
    price: 4200.00,
    stock_quantity: 70,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['oily', 'combination'],
    concerns_addressed: ['acne'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'alcohol-free', 'oil-free', 'fragrance-free', 'paraben-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000014',
    name: 'Alpha Arbutin 2% Dark Spot Corrector',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'A targeted brightening treatment featuring 2% purified Alpha Arbutin enhanced with Licorice Root Extract and Ethyl Ascorbic Acid. Visibly fades stubborn post-blemish discoloration, sun spots, and melasma for a unified complexion.',
    price: 6800.00,
    stock_quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'oily', 'combination', 'normal'],
    concerns_addressed: ['dark-spots', 'dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'hydroquinone-free', 'fragrance-free', 'paraben-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000015',
    name: 'Ceramide Multi-Depth Barrier Moisture Balm',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'An ultra-nourishing lipid cushion with 5 bio-identical ceramides (EOP, NS, NP, AS, AP), cholesterol, and oat beta-glucan. Forms an invisible protective shield over dry, flaky, or barrier-compromised skin for lasting supple softness.',
    price: 7900.00,
    stock_quantity: 40,
    images: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'sensitive', 'normal'],
    concerns_addressed: ['dryness', 'dehydration', 'redness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'fragrance-free', 'steroid-free', 'paraben-free'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000016',
    name: 'Petal Dew Lip & Cheek Cream Tint',
    brand: 'AuraGlow',
    category: 'makeup',
    description: 'A multi-use dewy cream blush and lip tint that melts seamlessly upon skin contact. Enriched with botanical Camellia seed oil and Vitamin E for a radiant, healthy flushed glow that never feels sticky.',
    price: 3800.00,
    stock_quantity: 55,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
    concerns_addressed: ['dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'carmine-free', 'paraben-free', 'silicone-free'],
    shades: [
      { name: 'Peony Glow (Soft Pink)', hex: '#E89EB0', stock: 15, tone: 'light', undertone: 'cool' },
      { name: 'Amber Sunrise (Terracotta)', hex: '#CF6D4E', stock: 15, tone: 'medium', undertone: 'warm' },
      { name: 'Desert Rose (Neutral Mauve)', hex: '#B8727C', stock: 13, tone: 'medium', undertone: 'neutral' },
      { name: 'Wild Berry (Deep Berry)', hex: '#87344D', stock: 12, tone: 'deep', undertone: 'cool' }
    ],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000017',
    name: 'Radiant Glow Skin Tint SPF 30',
    brand: 'AuraGlow',
    category: 'makeup',
    description: 'A clean 3-in-1 hydrating skin tint, daily mineral sunscreen, and antioxidant serum. Evens tone with sheer, dewy coverage while providing non-nano Zinc Oxide broad-spectrum UVA/UVB protection without white cast.',
    price: 7600.00,
    stock_quantity: 60,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'combination', 'sensitive', 'normal'],
    concerns_addressed: ['dehydration', 'dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'chemical-uv-free', 'reef-safe', 'fragrance-free'],
    shades: [
      { name: 'Fair 01 (Warm)', hex: '#F7E7DC', stock: 12, tone: 'light', undertone: 'warm' },
      { name: 'Light 02 (Neutral)', hex: '#ECD4C2', stock: 12, tone: 'light', undertone: 'neutral' },
      { name: 'Medium 03 (Golden)', hex: '#DEB997', stock: 14, tone: 'medium', undertone: 'warm' },
      { name: 'Tan 04 (Warm Amber)', hex: '#BE8C5E', stock: 11, tone: 'tan', undertone: 'warm' },
      { name: 'Deep 05 (Rich Bronze)', hex: '#7C4927', stock: 11, tone: 'deep', undertone: 'neutral' }
    ],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000018',
    name: 'Mineral Dew Creaseless Concealer',
    brand: 'AuraGlow',
    category: 'makeup',
    description: 'An ultra-blendable, non-creasing fluid concealer with Caffeine and Squalane. Instantly conceals blemishes and visibly de-puffs tired under-eye bags while maintaining a fresh, radiant skin-like finish.',
    price: 4600.00,
    stock_quantity: 75,
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
    concerns_addressed: ['dark-spots', 'dullness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'talc-free', 'silicone-free', 'paraben-free'],
    shades: [
      { name: 'C1 Fair Cool', hex: '#F9E6DB', stock: 12, tone: 'light', undertone: 'cool' },
      { name: 'W1 Light Warm', hex: '#F0D4BF', stock: 13, tone: 'light', undertone: 'warm' },
      { name: 'N2 Medium Neutral', hex: '#DEBA9A', stock: 15, tone: 'medium', undertone: 'neutral' },
      { name: 'W2 Medium Golden', hex: '#D2A478', stock: 13, tone: 'medium', undertone: 'warm' },
      { name: 'W3 Tan Honey', hex: '#B57C4F', stock: 11, tone: 'tan', undertone: 'warm' },
      { name: 'N3 Deep Cocoa', hex: '#633B22', stock: 11, tone: 'deep', undertone: 'neutral' }
    ],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000019',
    name: 'Oat Milk Soothing Barrier Cleanser',
    brand: 'AuraGlow',
    category: 'skincare',
    description: 'A comforting, non-foaming cleansing cream crafted with micro-milled Colloidal Oatmeal, Bisabolol, and Sweet Almond Oil. Cleanses away dirt and stubborn makeup while cocooning sensitive and hyper-reactive skin in soothing moisture.',
    price: 3600.00,
    stock_quantity: 65,
    images: [
      'https://images.unsplash.com/photo-1556228578-dd539282b964?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['sensitive', 'dry', 'normal'],
    concerns_addressed: ['redness', 'dehydration', 'dryness'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'soap-free', 'sulfate-free', 'fragrance-free', 'hypoallergenic'],
    shades: [],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  },
  {
    id: 'b2000000-0000-0000-0000-000000000020',
    name: 'Peptide Glaze Hydrating Lip Oil',
    brand: 'AuraGlow',
    category: 'makeup',
    description: 'A cushiony, non-sticky luxury lip oil packed with Maxi-Lip volumizing peptides, cold-pressed Jojoba oil, and Vitamin C. Plumps the appearance of fine lip lines with mirror-like shine and lasting comfort.',
    price: 3400.00,
    stock_quantity: 80,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    skin_types_compatible: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
    concerns_addressed: ['dehydration'],
    clean_beauty_tags: ['vegan', 'cruelty-free', 'mineral-oil-free', 'gluten-free', 'paraben-free'],
    shades: [
      { name: 'Crystal Clear (High Gloss)', hex: '#FFFFFF', stock: 20, tone: 'all', undertone: 'neutral' },
      { name: 'Rose Quartz (Sheer Pink)', hex: '#F2A9B8', stock: 20, tone: 'light', undertone: 'cool' },
      { name: 'Honey Peach (Warm Nude)', hex: '#EAA27D', stock: 20, tone: 'medium', undertone: 'warm' },
      { name: 'Blackberry Glaze (Sheer Plum)', hex: '#773549', stock: 20, tone: 'deep', undertone: 'cool' }
    ],
    is_vegan: true,
    is_cruelty_free: true,
    is_active: true
  }
];

async function seed() {
  console.log(`🌸 Seeding ${newProducts.length} new AuraGlow cosmetics and skincare products...`);
  
  const { data, error } = await supabase
    .from('products')
    .upsert(newProducts, { onConflict: 'id' })
    .select('id, name, brand, category, price');

  if (error) {
    console.error('❌ Upsert failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted/updated ${data.length} products!`);
  data.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.category.toUpperCase()}] ${p.name} - LKR ${p.price}`);
  });

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`🎉 Total products in Supabase: ${count}`);
}

seed();
