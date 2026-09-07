import { createClient } from '@supabase/supabase-js';
import { Checkpoint } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all active checkpoints from Supabase
 */
export async function fetchLiveCheckpoints(): Promise<Checkpoint[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('checkpoints')
      .select('*')
      .order('reported_timestamp', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }

    if (!data) return [];

    // Map database snake_case columns to Checkpoint interface
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      locationName: item.location_name,
      lat: Number(item.lat),
      lng: Number(item.lng),
      category: item.category,
      direction: item.direction,
      directionText: item.direction_text,
      note: item.note,
      reportedTimestamp: Number(item.reported_timestamp),
      reportedBy: item.reported_by || 'สมาชิกชุมชน',
      upvotes: Number(item.upvotes || 0),
      downvotes: Number(item.downvotes || 0),
      status: item.status || 'active',
    }));
  } catch (err) {
    console.warn('Error fetching live checkpoints:', err);
    return null;
  }
}

/**
 * Insert a new checkpoint to Supabase
 */
export async function insertLiveCheckpoint(cp: Checkpoint): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('checkpoints').insert([
      {
        id: cp.id,
        title: cp.title,
        location_name: cp.locationName,
        lat: cp.lat,
        lng: cp.lng,
        category: cp.category,
        direction: cp.direction,
        direction_text: cp.directionText,
        note: cp.note,
        reported_timestamp: cp.reportedTimestamp,
        reported_by: cp.reportedBy,
        upvotes: cp.upvotes,
        downvotes: cp.downvotes,
        status: cp.status,
      },
    ]);

    if (error) {
      console.warn('Error inserting to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error inserting checkpoint:', err);
    return false;
  }
}

/**
 * Vote on a checkpoint (Up/Down) in Supabase
 */
export async function voteLiveCheckpoint(
  id: string,
  upvotes: number,
  downvotes: number,
  status: string,
  refreshedTimestamp?: number
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const updateData: any = {
      upvotes,
      downvotes,
      status,
    };
    if (refreshedTimestamp) {
      updateData.reported_timestamp = refreshedTimestamp;
    }

    const { error } = await supabase
      .from('checkpoints')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.warn('Error updating vote in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error voting in Supabase:', err);
    return false;
  }
}
