import { supabase } from './supabase';

export interface PricingData {
  avg_price: number;
  min_price: number;
  max_price: number;
  sample_count: number;
  confidence_score: number;
  data_source: string;
  location_type: 'exact' | 'general' | 'fallback';
}

export async function getPricingData(
  category: string,
  subcategory: string,
  postalCode: string
): Promise<PricingData | null> {
  
  // Extract first 3 characters (M5V from M5V 2G3)
  const postalPrefix = postalCode.substring(0, 3).toUpperCase();
  
  // Strategy 1: Try exact postal code match
  let { data, error } = await supabase
    .from('pricing_data')
    .select('*')
    .eq('category', category)
    .eq('subcategory', subcategory)
    .eq('postal_code_prefix', postalPrefix)
    .single();

  if (data && !error) {
    return { ...data, location_type: 'exact' };
  }

  // Strategy 2: Try general area (M5*)
  const areaPrefix = postalPrefix.substring(0, 2); // M5 from M5V
  ({ data, error } = await supabase
    .from('pricing_data')
    .select('*')
    .eq('category', category)
    .eq('subcategory', subcategory)
    .like('postal_code_prefix', `${areaPrefix}%`)
    .order('confidence_score', { ascending: false })
    .limit(1)
    .single());

  if (data && !error) {
    return { ...data, location_type: 'general' };
  }

  // Strategy 3: Try Toronto general fallback
  ({ data, error } = await supabase
    .from('pricing_data')
    .select('*')
    .eq('category', category)
    .eq('subcategory', subcategory)
    .eq('postal_code_prefix', 'TORONTO')
    .single());

  if (data && !error) {
    return { ...data, location_type: 'fallback' };
  }

  // Strategy 4: Try category average (any subcategory, any location)
  ({ data, error } = await supabase
    .from('pricing_data')
    .select('*')
    .eq('category', category)
    .order('confidence_score', { ascending: false })
    .limit(1)
    .single());

  if (data && !error) {
    return { ...data, location_type: 'fallback' };
  }

  return null;
}
